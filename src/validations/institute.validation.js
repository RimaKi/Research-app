const { body, param, query } = require("express-validator");
const mongoose = require("mongoose");

const instituteValidation = {

    getById: [
        param("id")
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage("Invalid ID format"),
    ]
};

module.exports = instituteValidation;
