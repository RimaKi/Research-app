const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            token_hash: {
                type: String,
                unique: true,
                required: true
            },
            revoked: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: true,
        }
    )
;

const RefreshToken = mongoose.model("Refresh_Token", refreshTokenSchema);

module.exports = RefreshToken;
