const express = require("express")
const router = new express.Router()
const product = require("../controller/product/product.controller")
const sellOrder = require("../controller/product/sell.controller")
const { auth } = require("../middleware/auth")
router.get("/", auth, product.getAll)
router.post("/", auth, product.add)
router.delete("/", auth, product.remove)
router.put("/", auth, product.update)

router.post("/sell-order", auth, sellOrder.add)
// router.get("/sell-order", auth, sellOrder.get)
// router.delete("/sell-order", auth, sellOrder.remove)


module.exports = router
