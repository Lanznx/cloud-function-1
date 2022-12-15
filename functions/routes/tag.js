const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const tag = require("../controller/tag/tag.controller.js")
router.post("/", auth, tag.add)
router.get("/", auth, tag.getAll)
router.delete("/", auth, tag.remove)

module.exports = router
