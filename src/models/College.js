const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
    {
        college_name: {
            type: String,
            trim: true,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        institute_id : {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
        }
    },
    {
        timestamps: true,
    }
);

const College = mongoose.model("College", collegeSchema);

module.exports = College;
