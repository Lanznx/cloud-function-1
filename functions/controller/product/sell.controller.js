const { checkColumn, isNumber } = require("../../helper/checkColumn")
const {
  addOrderModel,
  getOrderModel,
  removeOrderModel,
  updateOrderModel,
  getOrderListWithGap,
  getOrderListWithPagination,
} = require("../../model/product/sell.model")

const add = async (req, res) => {
  const { uid } = req.middleware
  const {
    productList,
    tagList,
    staffName,
    discount,
    note,
    totalPrice,
  } = req.body
  const orderDTO = {
    uid: uid,
    productList: productList,
    tagList: tagList,
    timestamp: Date.now(),
    staffName: staffName,
    discount: discount,
    totalPrice: totalPrice,
    note: note,
  }

  const optionalKeys = ["tagList", "note"]
  const orderMissedKey = checkColumn(orderDTO, optionalKeys)
  if (orderMissedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${orderMissedKey}`,
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      price: product["price"],
      pid: product["pid"],
      productName: product["productName"],
    }
    const productMissedKey = checkColumn(productDTO, [])
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `麻煩提供 ${productMissedKey}`,
      })
    } else if (!isNumber(productDTO["price"])) {
      return res.status(400).send({
        success: false,
        message: "價錢應為數字",
      })
    }
  }
  if (!isNumber(discount) || !isNumber(totalPrice)) {
    return res.status(400).send({
      success: false,
      message: "折扣與總價應為數字",
    })
  } else if (discount < 0) {
    return res.status(400).send({
      success: false,
      message: "折扣應為正數",
    })
  }

  try {
    const orderId = await addOrderModel(orderDTO)
    return res.status(200).send({
      success: true,
      message: "成功加入訂單",
      orderId: orderId,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "加入訂單失敗，請聯絡客服",
      err: error,
    })
  }
}

const getAll = async (req, res) => {
  const { uid } = req.middleware
  let { startAt, limit, staffName, endAt } = req.query
  startAt = parseInt(startAt)
  endAt = parseInt(endAt)
  limit = parseInt(limit)
  if (endAt > startAt) {
    const temp = endAt
    endAt = startAt
    startAt = temp
  }
  const paginationDTO = {
    uid: uid,
    startAt: startAt,
    limit: limit,
    staffName: staffName,
  }
  const paginationMissedKey = checkColumn(paginationDTO, ["staffName"])

  const gapDTO = {
    uid: uid,
    startAt: startAt,
    endAt: endAt,
    staffName: staffName,
  }
  const gapMissedKey = checkColumn(gapDTO, ["staffName"])

  try {
    if (!paginationMissedKey) {
      const orderList = await getOrderListWithPagination(paginationDTO)
      if (orderList.length === 0) {
        return res.status(200).send({
          success: true,
          message: "成功獲取訂單",
          orderList: orderList,
        })
      }
      return res.status(200).send({
        success: true,
        message: "成功獲取訂單",
        orderList: orderList,
      })
    } else if (!gapMissedKey) {
      const orderList = await getOrderListWithGap(gapDTO)
      if (orderList.length === 0) {
        return res.status(200).send({
          success: true,
          message: "成功獲取訂單",
          orderList: orderList,
        })
      }
      return res.status(200).send({
        success: true,
        message: "成功獲取訂單",
        orderList: orderList,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "獲取訂單失敗",
      err: error,
    })
  }
}

const remove = async (req, res) => {
  const { uid } = req.middleware
  const { orderId } = req.query
  if (!orderId) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供 orderId",
    })
  }
  try {
    const order = await getOrderModel(orderId)
    if (order === -1) {
      return res.status(200).send({
        success: true,
        message: `找不到 ${orderId} `,
      })
    }
    if (order["uid"] !== uid) {
      return res.status(403).send({
        success: false,
        message: "你沒有權限刪除此訂單",
      })
    }
    removeOrderModel(orderId)
    return res.status(200).send({
      success: true,
      message: "成功移除訂單",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "移除訂單失敗，請聯絡客服",
      err: error,
    })
  }
}

const update = async (req, res) => {
  const { uid } = req.middleware
  const { orderId } = req.query
  const {
    productList,
    tagList,
    staffName,
    discount,
    note,
    totalPrice,
  } = req.body

  if (!orderId) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供 orderId",
    })
  }

  const orderDTO = {
    uid: uid,
    productList: productList,
    tagList: tagList,
    timestamp: Date.now(),
    staffName: staffName,
    discount: discount,
    totalPrice: totalPrice,
    note: note,
  }
  const optionalKeys = ["tagList", "note"]
  const missedKey = checkColumn(orderDTO, optionalKeys)
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      price: product["price"],
      pid: product["pid"],
      productName: product["productName"],
    }
    const productMissedKey = checkColumn(productDTO, [])
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `麻煩提供 ${productMissedKey}`,
      })
    } else if (!isNumber(productDTO["price"])) {
      return res.status(400).send({
        success: false,
        message: "價錢應為數字",
      })
    }
  }
  if (!isNumber(discount) || !isNumber(totalPrice)) {
    return res.status(400).send({
      success: false,
      message: "折扣價錢應為數字",
    })
  } else if (discount < 0) {
    return res.status(400).send({
      success: false,
      message: "折扣價錢應為正數",
    })
  }

  try {
    const order = await getOrderModel(orderId)
    if (order === -1) {
      return res.status(200).send({
        success: true,
        message: `找不到 ${orderId} `,
      })
    }
    if (order["uid"] !== uid) {
      return res.status(403).send({
        success: false,
        message: "你沒有權限更新此訂單",
      })
    }
    await updateOrderModel(orderId, orderDTO)
    return res.status(200).send({
      success: true,
      message: "成功更新訂單",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "更新訂單失敗，請聯絡客服",
      err: error,
    })
  }
}


module.exports = {
  add,
  getAll,
  remove,
  update,
}
