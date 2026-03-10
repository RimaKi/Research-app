const mongoose = require("mongoose");

const grantSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },

        domain: {
            type: String,
            trim: true,
            required: true,
            index: true,
            enum: ['AI','Medicine','Engineering','Agriculture']
        },

        funded_by: {
            type: String,
            trim: true,
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        start_date: {
            type: Date,
            required: true,
            index: true
        },

        end_date: {
            type: Date,
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: ['pending','canceled','available','closed'],
            default: 'pending',
            index: true
        },

        center_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ResearchCenter",
            required: true,
            index: true
        },

        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    {
    timestamps: true,
    }
);
// Date validation
grantSchema.pre('validate', function () {
    if (this.end_date <= this.start_date) {
        throw new Error('End date must be after start date');
    }
});


const Grant = mongoose.model("Grant", grantSchema);

module.exports = Grant;
