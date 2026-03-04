const express = require("express");

const router = express.Router();
const ResearcherController = require("../controllers/ResearcherController");

const {requireAuth, authorize} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");
const {
    createResearcher,
    updateResearcher,
    getResearcherById
} = require("../validations/researcher.validation");


// router.use(requireAuth);

router.post("/",
    [
        requireAuth,
        authorize("admin"),
        [...createResearcher, validate]
    ],
    asyncHandler(ResearcherController.create));

router.put("/:id",
    [
        requireAuth,
        authorize("admin"),
        [...updateResearcher, validate]
    ],
    asyncHandler(ResearcherController.update));

router.put("/:id",
    [
        requireAuth,
        authorize("admin"),
        [...updateResearcher, validate]
    ],
    asyncHandler(ResearcherController.update));

router.delete("/:id",
    [
        requireAuth,
        authorize("admin"),
        [...getResearcherById, validate]
    ],
    asyncHandler(ResearcherController.delete));

router.get("/:id",
    [
        requireAuth,
        [...getResearcherById, validate]
    ],
    asyncHandler(ResearcherController.getById));

router.get("/",
    [
        requireAuth
    ],
    asyncHandler(ResearcherController.getAll));

module.exports = router;