const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const material = require("../controller/material/material.controller")
const purchaseOrder = require("../controller/material/purchase.controller")

router.get("/predict", auth, material.getPredictMaterial)
router.get("/user-material", auth, material.getUserMaterial)
router.post("/purchase-order", auth, purchaseOrder.add)
router.delete("/purchase-order/:orderId", auth, purchaseOrder.remove)
router.get("/purchase-order", auth, purchaseOrder.getPurchaseOrder)

module.exports = router
