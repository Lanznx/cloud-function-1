const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const material = require("../controller/material/material.controller")
router.get("/all", auth, material.getMaterial)
router.get("/user-material", auth, material.getUserMaterial)

module.exports = router
