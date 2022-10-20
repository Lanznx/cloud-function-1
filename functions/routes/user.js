const express = require("express")
const router = new express.Router()
const userProfile = require("../controller/user/profile.controller")
// const userSign = require("../controller/user/sign.controller")
router.get("/profile", userProfile.getProfile)
router.post("profile", userProfile.createProfile)
router.put("/profile", userProfile.updateProfile)

module.exports = router
