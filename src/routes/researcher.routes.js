const express = require("express");

const router = express.Router();
const ResearcherController = require("../controllers/ResearcherController");

const {requireAuth, authorize} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");
const {
    createResearcher,
    updateResearcher,
    getResearcherById,
    deleteResearcher
} = require("../validations/researcher.validation");


router.use(requireAuth);

router.post("/",
    [
        requireAuth,
        authorize("admin"),
        [...createResearcher, validate]
    ],
    asyncHandler(ResearcherController.create));


module.exports = router;