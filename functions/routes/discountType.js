const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const discountType = require(
  "../controller/discountType/discountType.controller.js"
)
router.post("/", auth, discountType.add)
router.get("/", auth, discountType.get)
router.delete("/", auth, discountType.remove)

module.exports = router
