const express = require("express")
const router = new express.Router()
const product = require("../controller/product/product.controller")
const { auth } = require("../middleware/auth")
router.get("/", auth, product.getAll)
router.post("/", auth, product.add)
router.delete("/", auth, product.remove)
router.put("/", auth, product.update)


module.exports = router
