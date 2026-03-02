const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        department_name: {
            type: String,
            trim: true,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        college_id: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
        }
    },
    {
        timestamps: true,
    }
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
