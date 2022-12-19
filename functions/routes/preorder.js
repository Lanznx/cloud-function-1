const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const preorder = require("../controller/preorder/preorder.controller")
router.post("/", auth, preorder.add)
router.put("/", auth, preorder.update)

module.exports = router
