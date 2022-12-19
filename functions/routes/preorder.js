const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const form = require("../controller/preorder/form.controller")
router.post("/", auth, form.add)
router.put("/", auth, form.update)
router.get("/", auth, form.get)

module.exports = router
