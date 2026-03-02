const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
    {
        institute_name: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            minlength: 2,
            maxlength: 50
        }
    },
    {
        timestamps: true,
    }
);

const Institute = mongoose.model("Institute", instituteSchema);

module.exports = Institute;
