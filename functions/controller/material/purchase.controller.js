const checkColumn = require("../../helper/checkColumn")
const { addPurchaseOrder } = require("../../model/material/purchase.model")

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
      message: `your purchase order id is ${docId}`,
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
}
