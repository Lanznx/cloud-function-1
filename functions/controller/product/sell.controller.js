const checkColumn = require("../../helper/checkColumn")
const {
  getProductModel,
  updateProductModel,
} = require("../../model/product/product.model")
const {
  addOrderModel, getOrderListByUserModel, getOrderListByEmployeeModel,
} = require("../../model/product/sell.model")

const add = async (req, res) => {
  const { uid } = req.middleware
  const {
    productList,
    tagList,
    timestamp,
    staffName,
    discount,
    note,
    totalPrice,
  } = req.body
  const orderDTO = {
    uid: uid,
    productList: productList,
    tagList: tagList,
    timestamp: timestamp,
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
      amount: product["amount"],
      price: product["price"],
      productId: product["productId"],
      productName: product["productName"],
    }
    const productMissedKey = checkColumn(productDTO)
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `hey! please provide ${productMissedKey}`,
      })
    }
  }
  if (discount > 0) {
    return res.status(400).send({
      success: false,
      message: "discount should be negative",
    })
  }

  try {
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i]
      const oldProduct = await getProductModel(product["productId"])
      if (oldProduct === -1) {
        return res.status(404).send({
          success: false,
          message: `hey! product ${product["productId"]} not found`,
        })
      } else if (oldProduct["amount"] < product["amount"]) {
        return res.status(400).send({
          success: false,
          message: `hey! product ${product["productId"]} is out of stock`,
        })
      }
      const newProduct = {
        amount: oldProduct["amount"] - product["amount"],
        price: oldProduct["price"],
        name: oldProduct["name"],
        type: oldProduct["type"],
        uid: oldProduct["uid"],
        productId: product["productId"],
      }
      updateProductModel(newProduct)
    }

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
        return res.status(404).send({
          success: false,
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


module.exports = {
  add,
  getAll,
}
