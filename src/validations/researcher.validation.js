const {body, param, query} = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/User");
const Institute = require("../models/Institute");
const College = require("../models/College");
const Department = require("../models/Department");

const Researcher = require('../models/Researcher');
const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;

const ResearcherValidation = {
    createResearcher: [
        body("first_name")
            .notEmpty().withMessage("First Name is required")
            .isLength({min: 2, max: 50})
            .withMessage("Name must be between 2 and 50 characters")
            .bail(),

        body("last_name")
            .notEmpty().withMessage("Last Name is required")
            .isLength({min: 2, max: 50})
            .withMessage("Name must be between 2 and 50 characters")
            .bail(),

        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email format")
            .normalizeEmail()
            .custom(async (email) => {
                    const existingUser = await User.findOne({email});
                    if (existingUser) {
                        throw new Error("Invalid email");
                    }
                    return true;
                }
            )
            .bail(),

        body("password")
            .notEmpty().withMessage("Password is required").bail()
            .isLength({min: 6}).withMessage("Password must be at least 6 characters long").bail()
            .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
                returnScore: false
            }).withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),

        body("password_confirmation")
            .notEmpty().withMessage("Password confirmation is required").bail()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error("Password confirmation does not match password");
                }
                return true;
            }),

        body("phone")
            .notEmpty().withMessage("Phone number is required")
            .isMobilePhone("any")
            .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).withMessage("Invalid phone number")
            .trim()
            .bail(),

        body("institute_id")
            .notEmpty().withMessage('Institute is required')
            .isMongoId().withMessage('Institute must be a valid Mongo ID')
            .custom(async (value) => {
                const institute = await Institute.findById(value);
                if (!institute) {
                    throw new Error("Institute not found");
                }
                return true;
            }),

        body("college_id")
            .notEmpty().withMessage('College is required')
            .isMongoId().withMessage('College must be a valid Mongo ID')
            .custom(async (value) => {
                const college = await College.findById(value);
                if (!college) {
                    throw new Error("College not found");
                }
                return true;
            }),

        body("department_id")
            .notEmpty().withMessage('Department is required')
            .isMongoId().withMessage('Department must be a valid Mongo ID')
            .custom(async (value) => {
                const department = await Department.findById(value);
                if (!department) {
                    throw new Error("Department not found");
                }
                return true;
            }),
        body('orcid_id')
            .optional()
            .trim()
            .matches(orcidRegex)
            .withMessage('Invalid ORCID format')
            .custom(async (value) => {
                const exists = await Researcher.findOne({orcid_id: value});
                if (exists) {
                    throw new Error('ORCID already exists');
                }
                return true;
            })
            .bail(),

        body('scopus_id')
            .optional()
            .trim()
            .custom(async (value) => {
                const exists = await Researcher.findOne({scopus_id: value});
                if (exists) {
                    throw new Error('Scopus ID already exists');
                }
                return true;
            })
            .bail(),

        body('google_scholar_id')
            .optional()
            .trim()
            .custom(async (value) => {
                const exists = await Researcher.findOne({google_scholar_id: value});
                if (exists) {
                    throw new Error('Google Scholar ID already exists');
                }
                return true;
            })
            .bail(),

        body('research_theme')
            .optional()
            .trim()
            .isLength({max: 1000})
            .withMessage('Research theme must not exceed 1000 characters'),

        body('hindex')
            .optional()
            .isInt({min: 0})
            .withMessage('H-index must be a non-negative integer')
            .toInt()
    ],

    updateResearcher: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid Researcher ID format"),

        body("first_name")
            .isLength({min: 2, max: 50})
            .withMessage("Name must be between 2 and 50 characters")
            .bail(),

        body("last_name")
            .isLength({min: 2, max: 50})
            .withMessage("Name must be between 2 and 50 characters")
            .bail(),

        body("email")
            .isEmail().withMessage("Invalid email format")
            .normalizeEmail()
            .custom(async (email) => {
                const existingUser = await User.findOne({email});
                if (existingUser) {
                    throw new Error("Invalid email");
                }
                return true;
            })
            .bail(),

        body("phone")
            .notEmpty().withMessage("Phone number is required")
            .isMobilePhone("any")
            .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).withMessage("Invalid phone number")
            .trim()
            .bail(),

        body("institute_id")
            .notEmpty().withMessage('Institute is required')
            .isMongoId().withMessage('Institute must be a valid Mongo ID')
            .custom(async (value) => {
                const institute = await Institute.findById(value);
                if (!institute) {
                    throw new Error("Institute not found");
                }
                return true;
            }),

        body("college_id")
            .notEmpty().withMessage('College is required')
            .isMongoId().withMessage('College must be a valid Mongo ID')
            .custom(async (value) => {
                const college = await College.findById(value);
                if (!college) {
                    throw new Error("College not found");
                }
                return true;
            }),

        body("department_id")
            .notEmpty().withMessage('Department is required')
            .isMongoId().withMessage('Department must be a valid Mongo ID')
            .custom(async (value) => {
                const department = await Department.findById(value);
                if (!department) {
                    throw new Error("Department not found");
                }
                return true;
            }),
        body('orcid_id')
            .optional()
            .trim()
            .matches(orcidRegex)
            .withMessage('Invalid ORCID format')
            .custom(async (value) => {
                const exists = await Researcher.findOne({orcid_id: value});
                if (exists) {
                    throw new Error('ORCID already exists');
                }
                return true;
            })
            .bail(),

        body('scopus_id')
            .optional()
            .trim()
            .custom(async (value) => {
                const exists = await Researcher.findOne({scopus_id: value});
                if (exists) {
                    throw new Error('Scopus ID already exists');
                }
                return true;
            })
            .bail(),

        body('google_scholar_id')
            .optional()
            .trim()
            .custom(async (value) => {
                const exists = await Researcher.findOne({google_scholar_id: value});
                if (exists) {
                    throw new Error('Google Scholar ID already exists');
                }
                return true;
            })
            .bail(),

        body('research_theme')
            .optional()
            .trim()
            .isLength({max: 1000})
            .withMessage('Research theme must not exceed 1000 characters'),

        body('hindex')
            .optional()
            .isInt({min: 0})
            .withMessage('H-index must be a non-negative integer')
            .toInt()
    ],

    getResearcherById: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format")
    ],

    deleteResearcher: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format"),
    ]
}


module.exports = ResearcherValidation;
