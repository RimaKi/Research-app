require("dotenv").config();
const User = require("../models/User");
const connectDB = require("../utils/connectDB");
const passwordService = require("../utils/passwordService")

const createAdminUser = async () => {
    try {
        await connectDB();

        const adminData = {
            first_name: process.env.ADMIN_FIRST_NAME,
            last_name: process.env.ADMIN_LAST_NAME,
            email: process.env.ADMIN_EMAIL,
            password: await passwordService.hashPassword(process.env.ADMIN_PASSWORD),
            phone: process.env.ADMIN_PHONE,
            role: "admin"
        }

        const existedAdmin = await User.findOne({ role: "admin" });
        if(existedAdmin) {
            console.error("Admin is already exist");
            process.exit(1);
        }

        await User.create(adminData);

        console.log("Admin is Created Successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error Creating Admin User:", error.message)
        process.exit(1);
    }
}

createAdminUser();