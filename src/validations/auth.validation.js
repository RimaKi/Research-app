const {body, param, query} = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/User");
const Institute = require("../models/Institute");
const College = require("../models/College");
const Department = require("../models/Department");


const authValidation = {
    registerValidation: [
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
            })
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
            .optional()
            .isMongoId().withMessage('Institute must be a valid Mongo ID')
            .custom(async (value) => {
                const institute = await Institute.findById(value);
                if (!institute) {
                    throw new Error("Institute not found");
                }
                return true;
            }),

        body("college_id")
            .optional()
            .isMongoId().withMessage('College must be a valid Mongo ID')
            .custom(async (value) => {
                const college = await College.findById(value);
                if (!college) {
                    throw new Error("College not found");
                }
                return true;
            }),

        body("department_id")
            .optional()
            .isMongoId().withMessage('Department must be a valid Mongo ID')
            .custom(async (value) => {
                const department = await Department.findById(value);
                if (!department) {
                    throw new Error("Department not found");
                }
                return true;
            }),

    ],
    loginValidation : [
        // Email exists
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email format")
            .normalizeEmail()
            .custom(async (email) => {
                const user = await User.findOne({email});
                if (!user) {
                    throw new Error("Email not found");
                }
                return true;
            })
            .bail(),

        // Strong password format
        body("password")
            .notEmpty().withMessage("Password is required").bail()
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").bail()
            .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
                returnScore: false
            }).withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),

    ],
};

module.exports = authValidation;
