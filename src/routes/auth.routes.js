const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middlewares/auth.middleware");

const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");

const authController = require("../controllers/AuthController");
const {
    registerValidation,
    loginValidation
} = require("../validations/auth.validation");

router.post(
    "/register",
    [...registerValidation, validate],
    asyncHandler(authController.register)
);

router.post(
    "/login",
    [...loginValidation, validate],
    asyncHandler(authController.login)
);

router.post(
    "/refresh-token",
    [requireAuth],
    asyncHandler(authController.refreshToken)
);

router.post("/logout", [requireAuth], asyncHandler(authController.logout));

router.get("/profile", [requireAuth], asyncHandler(authController.getPorfile));


module.exports = router;