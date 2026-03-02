const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            trim: true,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        last_name: {
            type: String,
            trim: true,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Invalid email format'
            }
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            trim: true,
            minlength: 7,
            maxlength: 20,
            match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone']
        },
        institute_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
        },
        college_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
        },
        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'researcher', 'viewer'],
            default: 'viewer'
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
