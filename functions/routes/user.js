const express = require("express")
const router = new express.Router()
const userProfileController = require("../controller/user/profile.controller")
const userSignController = require("../controller/user/sign.controller")
router.get("/profile", userProfileController.getUserProfile)
router.post("/signUp", userSignController.signUp)

module.exports = router
