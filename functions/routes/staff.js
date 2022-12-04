const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const staff = require("../controller/staff/staff.controller")
router.post("/", auth, staff.add)
router.get("/", auth, staff.getAll)
router.put("/", auth, staff.update)
router.delete("/", auth, staff.remove)

module.exports = router
