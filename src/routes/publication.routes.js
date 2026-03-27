const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/PublicationController");
const { requireAuth, authorize } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");
const { createPublication } = require("../validations/publication.validation");
const uploadLocal = require("../utils/multer");


router.post(
    "/",
    [
        requireAuth,
        authorize("researcher", "admin"),
        uploadLocal.single("pdf"),
        ...createPublication,
        validate
    ],
    asyncHandler(PublicationController.create)
);



module.exports = router;
