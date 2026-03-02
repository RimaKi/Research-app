const mongoose = require("mongoose");

const researchCenterSchema = new mongoose.Schema(
    {
        research_center_name: {
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

const ResearchCenter = mongoose.model("ResearchCenter", researchCenterSchema);

module.exports = ResearchCenter;
