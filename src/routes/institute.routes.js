const express = require("express");
const router = express.Router();

const InstituteController=require("../controllers/InstituteController")

const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");



router.get('/institutes', asyncHandler(InstituteController.getAllInstitute));
router.get('/colleges/:institutes_id', asyncHandler(InstituteController.getCollegesForInstitute));
router.get('/departments/:college_id', asyncHandler(InstituteController.getDepartmentsForCollege));
router.get('/research-centers/:institutes_id', asyncHandler(InstituteController.getResearchCenterForInstitute));

module.exports = router;