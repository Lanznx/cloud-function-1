const checkColumn = require("../../helper/checkColumn")
const {
  addPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderByTime,
} = require("../../model/material/purchase.model")
const {
  updateUserMaterialModel,
} = require("../../model/material/userMaterial.model")

const add = async (req, res) => {
  const { uid } = req.middleware
  const { materialList, timestamp, totalCost, type } = req.body
  const purchaseOrderDTO = {
    materialList: materialList,
    timestamp: timestamp,
    totalCost: totalCost,
    type: type,
    uid: uid,
  }
  const missedKey = checkColumn(purchaseOrderDTO)
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  } else if (purchaseOrderDTO["materialList"].length === 0) {
    return res.status(400).send({
      success: false,
      message: "materialList is empty",
    })
  } else if (purchaseOrderDTO["type"] !== "purchase" &&
    purchaseOrderDTO["type"] !== "consume" &&
    purchaseOrderDTO["type"] !== "adjust") {
    return res.status(400).send({
      success: false,
      message: "type should be purchase / consume / adjust",
    })
  } else if (purchaseOrderDTO["type"] === "consume" &&
    purchaseOrderDTO["totalCost"] > 0) {
    return res.status(400).send({
      success: false,
      message: "totalCost should be negative when type is consume",
    })
  } else if (purchaseOrderDTO["type"] === "adjust" &&
    purchaseOrderDTO["totalCost"] === 0) {
    return res.status(400).send({
      success: false,
      message: "totalCost should not be 0 when type is adjust",
    })
  }

  for (let i = 0; i < materialList.length; i++) {
    const material = materialList[i]
    if (material["amountChange"] <= 0 &&
      purchaseOrderDTO["type"] === "purchase") {
      return res.status(400).send({
        success: false,
        message: "amountChange should be positive when type is purchase",
      })
    } else if (material["amountChange"] >= 0 &&
      purchaseOrderDTO["type"] === "consume") {
      return res.status(400).send({
        success: false,
        message: "amountChange should be negative when type is consume",
      })
    }
  }

  try {
    for (let i = 0; i < materialList.length; i++) {
      const material = materialList[i]
      const result = await updateUserMaterialModel(
        material,
        uid,
      )
      if (result === -2) {
        return res.status(400).send({
          success: true, // success is true because the purchase order is added
          message: "success but some material quantity is not enough",
        })
      }
    }

    const purchaseOrderId = await addPurchaseOrder(purchaseOrderDTO)
    return res.status(201).send({
      success: true,
      message: `your purchaseOrder id is ${purchaseOrderId}`,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "unknow error",
    })
  }
}

const remove = async (req, res) => {
  const { orderId } = req.params
  const { materialId, isDeleteOrder } = req.body
  const missedKey = checkColumn({ materialId, isDeleteOrder })
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  }

  try {
    const docId = await deletePurchaseOrder(orderId, materialId, isDeleteOrder)
    if (docId === -1) {
      return res.status(404).send({
        success: false,
        message: "order not found",
      })
    } else if (docId === -2) {
      return res.status(404).send({
        success: false,
        message: "material not found",
      })
    }
    return res.status(200).send({
      success: true,
      message: "successfully deleted",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "unknow error",
    })
  }
}

const getPurchaseOrder = async (req, res) => {
  const { uid } = req.middleware
  const { startTime, endTime } = req.query
  const missedKey = checkColumn({ startTime, endTime })
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  }
  try {
    const purchaseOrderList = await getPurchaseOrderByTime(
      startTime,
      endTime,
      uid,
    )

    if (purchaseOrderList.length === 0) {
      return res.status(200).send({
        success: false,
        message: "no purchase order found",
        purchaseOrderList: [],
      })
    }

    return res.status(200).send({
      success: true,
      purchaseOrderList: purchaseOrderList,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "unknow error",
    })
  }
}


module.exports = {
  add,
  remove,
  getPurchaseOrder,
}
