const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/PublicationController");
const {requireAuth, authorize} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");
const uploadLocal = require("../utils/multer");
const checkPublicationAccess = require("../middlewares/checkPublicationAccess.middleware");


const {
    createPublication,
    updatePublication
} = require("../validations/publication.validation");


router.get(
    "/",
    asyncHandler(PublicationController.getAll)
);

router.get(
    "/:id",
    asyncHandler(PublicationController.getById)
);

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

router.put(
    "/:id", [
        requireAuth,
        authorize("researcher", "admin"),
        uploadLocal.single("pdf"),
        ...updatePublication,
        validate,
        checkPublicationAccess
    ],
    asyncHandler(PublicationController.update)
);

router.delete(
    "/:id", [
        requireAuth,
        authorize("researcher", "admin"),
        checkPublicationAccess
    ],
    asyncHandler(PublicationController.delete)
);


module.exports = router;
