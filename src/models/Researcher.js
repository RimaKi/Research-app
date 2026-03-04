const mongoose = require("mongoose");

const researcherSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orcid_id: {
            type: String,
            trim: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(v);
                },
                message: "Invalid ORCID format"
            },
        },
        scopus_id: {
            type: String,
            trim: true,
            unique: true
        },
        google_scholar_id: {
            type: String,
            trim: true,
            unique: true
        },
        research_theme: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        hindex: {
            type: Number,
            min: 0,
            default: 0
        },
        is_active:{
            type:Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

researcherSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.is_active;
        delete ret.__v;
        return ret;
    }
});

const Researcher = mongoose.model("Researcher", researcherSchema);

module.exports = Researcher;
