const express = require("express")
const router = new express.Router()

router.route("/add").post(require("./add"))
router.route("/delete").post(require("./delete"))
router.route("/update").post(require("./update"))

module.exports = router
