const { checkColumn, isNumber } = require("../../helper/checkColumn")
const {
  addOrderModel,
  getOrderListByUserModel,
  getOrderListByEmployeeModel,
  getOrderModel,
  removeOrderModel,
  updateOrderModel,
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
  const orderMissedKey = checkColumn(orderDTO)
  if (orderMissedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${orderMissedKey}`,
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      price: product["price"],
      pid: product["pid"],
      productName: product["productName"],
    }
    const productMissedKey = checkColumn(productDTO)
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `hey! please provide ${productMissedKey}`,
      })
    } else if (!isNumber(productDTO["price"])) {
      return res.status(400).send({
        success: false,
        message: "price should be number",
      })
    }
  }
  if (!isNumber(discount) || !isNumber(totalPrice)) {
    return res.status(400).send({
      success: false,
      message: "discount and totalPrice should be number",
    })
  } else if (discount > 0) {
    return res.status(400).send({
      success: false,
      message: "discount should be negative",
    })
  }

  try {
    const orderId = await addOrderModel(orderDTO)
    return res.status(200).send({
      success: true,
      message: "add order success",
      orderId: orderId,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "add order failed",
      err: error,
    })
  }
}

const getAll = async (req, res) => {
  const { uid } = req.middleware
  const { startAt, limit, staffName } = req.query
  if (!startAt || !limit) {
    return res.status(400).send({
      success: false,
      message: "hey! please provide startAt and limit",
    })
  }
  console.log(staffName, "staffName")
  try {
    if (staffName !== undefined) {
      const orderList = await getOrderListByEmployeeModel(
        uid,
        staffName,
        parseInt(startAt),
        parseInt(limit)
      )
      if (orderList.length === 0) {
        return res.status(404).send({
          success: false,
          message: "order list not found",
        })
      }
      return res.status(200).send({
        success: true,
        message: "get order list success",
        orderList: orderList,
      })
    } else {
      const orderList = await getOrderListByUserModel(
        uid,
        parseInt(startAt),
        parseInt(limit)
      )
      if (orderList.length === 0) {
        return res.status(200).send({
          success: true,
          message: "order list is empty",
        })
      }
      return res.status(200).send({
        success: true,
        message: "get order list success",
        orderList: orderList,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "get order list failed",
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
      message: "hey! please provide orderId",
    })
  }
  try {
    const order = await getOrderModel(orderId)
    if (order === -1) {
      return res.status(200).send({
        success: true,
        message: `hey! order ${orderId} not found`,
      })
    }
    if (order["uid"] !== uid) {
      return res.status(403).send({
        success: false,
        message: "hey! you are not allowed to delete this order",
      })
    }
    removeOrderModel(orderId)
    return res.status(200).send({
      success: true,
      message: "remove order success",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "remove order failed",
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
      message: "hey! please provide orderId",
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
  const missedKey = checkColumn(orderDTO)
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      price: product["price"],
      pid: product["pid"],
      productName: product["productName"],
    }
    const productMissedKey = checkColumn(productDTO)
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `hey! please provide ${productMissedKey}`,
      })
    } else if (!isNumber(productDTO["price"])) {
      return res.status(400).send({
        success: false,
        message: "price should be number",
      })
    }
  }
  if (!isNumber(discount) || !isNumber(totalPrice)) {
    return res.status(400).send({
      success: false,
      message: "discount and totalPrice should be number",
    })
  } else if (discount > 0) {
    return res.status(400).send({
      success: false,
      message: "discount should be negative",
    })
  }

  try {
    const order = await getOrderModel(orderId)
    if (order === -1) {
      return res.status(200).send({
        success: true,
        message: `hey! order ${orderId} not found`,
      })
    }
    if (order["uid"] !== uid) {
      return res.status(403).send({
        success: false,
        message: "hey! you are not allowed to update this order",
      })
    }
    await updateOrderModel(orderId, orderDTO)
    return res.status(200).send({
      success: true,
      message: "update order success",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "update order failed",
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
