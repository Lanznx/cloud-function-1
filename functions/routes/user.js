const express = require("express")
const router = new express.Router()
const userProfile = require("../controller/user/profile.controller")
const { auth } = require("../middleware/auth")
router.get("/profile", auth, userProfile.getProfile)
router.post("/profile", auth, userProfile.createProfile)
router.put("/profile", auth, userProfile.updateProfile)

module.exports = router
