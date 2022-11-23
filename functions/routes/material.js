const express = require("express")
const router = new express.Router()
const { auth } = require("../middleware/auth")
const material = require("../controller/material/material.controller")
const purchaseOrder = require("../controller/material/purchase.controller")

router.get("/predict", auth, material.getMaterial)
router.get("/user-material", auth, material.getUserMaterial)
router.post("/purchase-order", auth, purchaseOrder.add)

module.exports = router
