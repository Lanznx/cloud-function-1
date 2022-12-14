const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const stat = require("../controller/stat/stat.controller.js")
router.get("/product", auth, stat.getProductStat)

module.exports = router
