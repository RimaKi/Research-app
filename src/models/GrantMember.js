const mongoose = require("mongoose");

const grantMemberSchema = new mongoose.Schema(
    {
        grant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grant",
            required: true
        },
        researcher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Researcher",
            required: true
        },
        member_role: {
            type: String,
            enum: ["PI", "Co-PI", "Research Assistant"],
            required: true
        }
    },
    {
    timestamps: true,
    }
);

grantMemberSchema.index(
    { grant_id: 1, researcher_id: 1 },
    { unique: true }
);

const GrantMember = mongoose.model("Grant_member", grantMemberSchema);

module.exports = GrantMember;
