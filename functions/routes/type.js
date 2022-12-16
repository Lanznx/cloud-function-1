const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const type = require("../controller/type/type.controller.js")
router.post("/", auth, type.add)
router.get("/", auth, type.getAll)
router.delete("/", auth, type.remove)

module.exports = router
