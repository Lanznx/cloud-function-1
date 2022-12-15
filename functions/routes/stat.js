const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const stat = require("../controller/stat/stat.controller.js")
router.get("/product", auth, stat.getProductStat)
router.get("/type", auth, stat.getTypeStat)
router.get("/staff", auth, stat.getStaffStat)
router.get("/line", auth, stat.getLineChart)

module.exports = router
