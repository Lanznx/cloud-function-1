const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const form = require("../controller/preorder/form.controller")
const preorderUser = require("../controller/preorder/user.controller")
const preorderCustomer = require("../controller/preorder/customer.controller")
router.post("/", auth, form.add)
router.put("/", auth, form.update)
router.get("/", auth, form.get)
router.delete("/", auth, form.disable)

router.get("/user", auth, preorderUser.get)
// router.patch("/user/:preorderId", auth, preorderUser.finish)
// router.delete("/user/:preorderId", auth, preorderUser.remove)

router.get("/customer/:uid", preorderCustomer.get)
router.post("/customer/:uid", preorderCustomer.add)
module.exports = router
