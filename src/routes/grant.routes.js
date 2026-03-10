const express = require("express");
const router = express.Router();

const GrantController = require("../controllers/GrantController");

const {requireAuth, authorize} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHanlder");
const validate = require("../middlewares/validate.middleware");

const {
    createGrant,
    updateGrant,
    getGrantById,
    addMemberGrant,
    getAll,
    updateStatus
} = require("../validations/grant.validation");

router.post("/",
    [
        requireAuth,
        authorize("admin"),
        [...createGrant, validate]
    ],
    asyncHandler(GrantController.create));

router.put("/:id",
    [
        requireAuth,
        authorize("admin"),
        [...updateGrant, validate]
    ],
    asyncHandler(GrantController.update));

router.get("/",
    [
        requireAuth,
        [...getAll, validate]
    ],
    asyncHandler(GrantController.getAll));

router.get("/",
    requireAuth,
    asyncHandler(GrantController.getAll));

router.get("/:id",
    [
        requireAuth,
        [...getGrantById, validate]
    ],
    asyncHandler(GrantController.getById));

router.delete("/:id",
    [
        requireAuth,
        authorize("admin"),
        [...getGrantById, validate]
    ],
    asyncHandler(GrantController.delete));

router.patch("/:id",[
    requireAuth,
    authorize("admin"),
    [...updateStatus, validate]
],asyncHandler(GrantController.editGrantStatus));

router.post("/add-member",
    [
        requireAuth,
        authorize("admin"),
        [...addMemberGrant, validate]
    ],
    asyncHandler(GrantController.addMember));


module.exports = router;