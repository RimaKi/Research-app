const {body, param, query} = require("express-validator");
const mongoose = require("mongoose");

const ResearchCenter = require("../models/ResearchCenter");
const User = require("../models/User");
const Grant = require("../models/Grant");
const Researcher = require("../models/Researcher");

const allowedDomains = ['AI', 'Medicine', 'Engineering', 'Agriculture'];
const allowedStatus = ['pending', 'canceled', 'available', 'closed'];
const allowedRoles = ["PI", "Co-PI", "Research Assistant"];

const grantValidation = {
    createGrant: [
        body("title")
            .notEmpty().withMessage("Title is required")
            .isLength({max: 300})
            .withMessage("Title must not exceed 300 characters")
            .trim()
            .bail(),

        body("domain")
            .notEmpty().withMessage("Domain is required")
            .isIn(allowedDomains)
            .withMessage("Invalid domain value")
            .bail(),

        body("funded_by")
            .notEmpty().withMessage("Funded by is required")
            .trim()
            .bail(),

        body("amount")
            .notEmpty().withMessage("Amount is required")
            .isFloat({min: 0})
            .withMessage("Amount must be a non-negative number")
            .toFloat()
            .bail(),

        body("start_date")
            .notEmpty().withMessage("Start date is required")
            .isISO8601()
            .withMessage("Start date must be valid ISO8601 date")
            .toDate()
            .bail(),

        body("end_date")
            .notEmpty().withMessage("End date is required")
            .isISO8601()
            .withMessage("End date must be valid ISO8601 date")
            .toDate()
            .custom((value, {req}) => {
                if (new Date(value) <= new Date(req.body.start_date)) {
                    throw new Error("End date must be after start date");
                }
                return true;
            })
            .bail(),

        body("status")
            .optional()
            .isIn(allowedStatus)
            .withMessage("Invalid status value"),

        body("center_id")
            .notEmpty().withMessage("Center is required")
            .isMongoId().withMessage("Invalid Center ID format")
            .custom(async (value) => {
                const center = await ResearchCenter.findById(value);
                if (!center) {
                    throw new Error("Research Center not found");
                }
                return true;
            })
            .bail()

    ],

    updateGrant: [
        param("id")
            .isMongoId()
            .withMessage("Invalid grant ID"),

        body("title")
            .optional()
            .isLength({max: 300})
            .withMessage("Title must not exceed 300 characters"),

        body("domain")
            .optional()
            .isIn(allowedDomains)
            .withMessage("Invalid domain value"),

        body("funded_by")
            .optional()
            .trim(),

        body("amount")
            .optional()
            .isFloat({min: 0})
            .withMessage("Amount must be non-negative")
            .toFloat(),

        body("start_date")
            .optional()
            .isISO8601()
            .toDate(),

        body("end_date")
            .optional()
            .isISO8601()
            .toDate()
    ],

    getAll: [
        body("status")
            .optional()
            .isIn(allowedStatus)
            .withMessage("Invalid status value"),
    ],

    getGrantById: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format"),
    ],

    updateStatus:[
        body("status")
            .notEmpty().withMessage("Status is required")
            .isIn(allowedStatus)
            .withMessage("Invalid status value"),
    ],

    addMemberGrant: [
        body("grant_id")
            .notEmpty().withMessage("Grant ID is required")
            .isMongoId().withMessage("Invalid Grant ID format")
            .bail()
            .custom(async (value) => {
                const grant = await Grant.findById(value);
                if (!grant) {
                    throw new Error("Grant not found");
                }
                return true;
            }),

        body("researcher_id")
            .notEmpty().withMessage("Researcher ID is required")
            .isMongoId().withMessage("Invalid Researcher ID format")
            .bail()
            .custom(async (value) => {
                const researcher = await Researcher.findById(value);
                if (!researcher) {
                    throw new Error("Researcher not found");
                }
                return true;
            }),

        body("member_role")
            .notEmpty().withMessage("Member role is required")
            .isIn(allowedRoles)
            .withMessage("Invalid member role")
    ]
};

module.exports = grantValidation;
