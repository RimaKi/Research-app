const User = require("../models/User");
const tokenService = require("../utils/tokenService");
const collection = require("../utils/collection");

// Authentication
const requireAuth = async (req, res, next) => {
    try {
        // get token from request (access)
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(collection(false, "Authentication token missing", null, "UNAUTHORIZED"));
        }
        const token = authHeader.split(" ")[1];


        // verify the token (age, valid)
        const decoded = tokenService.verifyAccessToken(token)

        // decoded the token to get user details
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json(collection(false, "User no longer exists", null, "NOT_FOUND"));
        }
        // store date to use it next
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        next();
    } catch (error) {
        throw new Error(error.message);
    }
}

// Authorization

// HOF
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(collection(false, "Authentication Failed", null, "UNAUTHORIZED"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(collection(false, "Insufficient permissions", null, "FORBIDDEN"));
        }

        next();
    }
}

module.exports = {
    requireAuth,
    authorize
}