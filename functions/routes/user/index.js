const express = require("express")
const router = new express.Router()

router.route("/profile").get(require("./profile"))
router.route("/signUp").post(require("./signUp"))

module.exports = router
