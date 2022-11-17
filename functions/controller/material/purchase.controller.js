const checkColumn = require("../../helper/checkColumn")
const {
  addPurchaseOrder,
  deletePurchaseOrder,
} = require("../../model/material/purchase.model")

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
  }

  try {
    const docId = await addPurchaseOrder(purchaseOrderDTO)
    return res.status(201).send({
      success: true,
      message: `your purchaseOrder id is ${docId}`,
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


module.exports = {
  add,
  remove,
}
