const {body, param, query} = require("express-validator");
const mongoose = require("mongoose");

const Researcher = require("../models/Researcher");
const Grant = require("../models/Grant");


const publicationValidation = {
    createPublication: [
        body("title")
            .notEmpty().withMessage("Title is required")
            .isString().withMessage("Title must be a string")
            .isLength({max: 500}).withMessage("Title must not exceed 500 characters")
            .trim(),

        body("publication_year")
            .notEmpty().withMessage("Publication year is required")
            .isInt({min: 1900, max: new Date().getFullYear()})
            .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),

        body("abstract")
            .optional()
            .isString().withMessage("Abstract must be a string")
            .isLength({max: 5000}).withMessage("Abstract must not exceed 5000 characters")
            .trim(),

        body("authors")
            .isArray({min: 1}).withMessage("At least one author is required"),

        body("authors.*")
            .isMongoId().withMessage("Each author must be a valid Mongo ID")
            .custom(async (value) => {
                const researcher = await Researcher.findOne({_id: value});
                if (!researcher) {
                    throw new Error("Researcher not found");
                }
                return true;
            })
            .bail(),

        body("sources")
            .optional()
            .isArray().withMessage("Sources must be an array"),

        body("sources.*")
            .optional()
            .isString().withMessage("Each source must be a string")
            .trim(),

        body("type")
            .notEmpty().withMessage("Type is required")
            .isString().withMessage("Type must be a string"),
        // .isIn(['journal','conference','book','book_chapter','thesis','report'])
        // .withMessage("Invalid publication type"),

        body("publication_link")
            .optional()
            .matches(/^https?:\/\/.+/)
            .withMessage("Invalid publication link"),


        body("status")
            .optional()
            .isIn(["draft", "published"])
            .withMessage("Status must be draft or published"),


        body("grant_id")
            .optional()
            .isMongoId().withMessage("Invalid grant ID")
            .custom(async (value) => {
                const grant = await Grant.findOne({_id: value});
                if (!grant) {
                    throw new Error("Researcher not found");
                }
                return true;
            })
            .bail(),
    ],

    updatePublication: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format"),
        body("title")
            .optional()
            .isString().withMessage("Title must be a string")
            .isLength({max: 500}).withMessage("Title must not exceed 500 characters")
            .trim(),

        body("publication_year")
            .optional()
            .isInt({min: 1900, max: new Date().getFullYear()})
            .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),

        body("abstract")
            .optional()
            .isString().withMessage("Abstract must be a string")
            .isLength({max: 5000}).withMessage("Abstract must not exceed 5000 characters")
            .trim(),

        body("authors")
            .optional()
            .isArray({min: 1}).withMessage("At least one author is required"),

        body("authors.*")
            .optional()
            .isMongoId().withMessage("Each author must be a valid Mongo ID")
            .custom(async (value) => {
                const researcher = await Researcher.findOne({_id: value});
                if (!researcher) {
                    throw new Error("Researcher not found");
                }
                return true;
            })
            .bail(),

        body("sources")
            .optional()
            .isArray().withMessage("Sources must be an array"),

        body("sources.*")
            .optional()
            .isString().withMessage("Each source must be a string")
            .trim(),

        body("type")
            .optional()
            .isString().withMessage("Type must be a string"),
        // .isIn(['journal','conference','book','book_chapter','thesis','report'])
        // .withMessage("Invalid publication type"),

        body("publication_link")
            .optional()
            .matches(/^https?:\/\/.+/)
            .withMessage("Invalid publication link"),

        body("status")
            .optional()
            .isIn(["draft", "published"])
            .withMessage("Status must be draft or published"),

        body("grant_id")
            .optional()
            .isMongoId().withMessage("Invalid grant ID")
            .custom(async (value) => {
                const grant = await Grant.findOne({_id: value});
                if (!grant) {
                    throw new Error("Grant not found");
                }
                return true;
            })
            .bail(),
    ],

    getById: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format"),
    ],

    delete: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format"),
    ],
};

module.exports = publicationValidation;
