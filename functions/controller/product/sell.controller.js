const { checkColumn, removeUndefine } = require("../../helper/checkColumn")
const {
  getDiscountTypeList,
} = require("../../model/discountType/discountType.model")
const {
  addOrderModel,
  getOrderModel,
  removeOrderModel,
  updateOrderModel,
  getOrderListWithGap,
  getOrderListWithPagination,
} = require("../../model/product/sell.model")
const {
  addNewDiscountTypes,
  addNewNote,
  isDiscountTypesValid,
} = require("./discount.related")
const { addNewTag } = require("./tag.related")

const add = async (req, res) => {
  const { uid } = req.middleware
  let {
    productList,
    tagList,
    staffName,
    discountTypes,
    note,
    totalPrice,
  } = req.body
  totalPrice = parseInt(totalPrice)
  const orderDTO = {
    uid: uid,
    productList: productList,
    tagList: tagList,
    timestamp: Date.now(),
    staffName: staffName,
    discountTypes: discountTypes,
    totalPrice: totalPrice,
    note: note,
  }

  const optionalKeys = ["tagList", "note", "discountTypes"]
  const cleanOrderDTO = removeUndefine(orderDTO)
  const orderMissedKey = checkColumn(cleanOrderDTO, optionalKeys)
  if (orderMissedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${orderMissedKey}`,
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      price: parseInt(product["price"]),
      pid: product["pid"],
      productName: product["productName"],
      amount: parseInt(product["amount"]),
    }
    const productMissedKey = checkColumn(productDTO, [])
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `麻煩提供 ${productMissedKey}`,
      })
    }
  }

  // Check if discountTypes is valid
  const isValid = isDiscountTypesValid(discountTypes)
  if (isValid === -1) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供折扣類型名稱及折扣",
    })
  } else if (isValid === -2) {
    return res.status(400).send({
      success: false,
      message: "折扣應為正數",
    })
  }
  // add discountTypes to note
  const newNote = addNewNote(note, discountTypes)
  cleanOrderDTO["note"] = newNote

  // 如果 discountTypes 不存在於資料庫，則新增
  const discountTypeList = await getDiscountTypeList(uid)
  addNewDiscountTypes(discountTypeList, discountTypes, uid)

  try {
    if (tagList.length !== 0) {
      addNewTag(tagList, uid)
    }
    const orderId = await addOrderModel(cleanOrderDTO)
    if (orderId === -1) {
      return res.status(500).send({
        success: false,
        message: "加入訂單失敗，請聯絡客服",
      })
    }
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
  let { startAt, staffName, endAt } = req.query
  startAt = parseInt(startAt)
  endAt = parseInt(endAt)
  if (endAt > startAt) {
    const temp = endAt
    endAt = startAt
    startAt = temp
  }
  const paginationDTO = {
    uid: uid,
    startAt: startAt,
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
  let {
    productList,
    tagList,
    staffName,
    discountTypes,
    note,
    totalPrice,
  } = req.body
  totalPrice = parseInt(totalPrice)
  const orderDTO = {
    uid: uid,
    productList: productList,
    tagList: tagList,
    timestamp: Date.now(),
    staffName: staffName,
    discountTypes: discountTypes,
    totalPrice: totalPrice,
    note: note,
  }

  const optionalKeys = ["tagList", "note", "discountTypes"]
  const cleanOrderDTO = removeUndefine(orderDTO)
  const orderMissedKey = checkColumn(cleanOrderDTO, optionalKeys)
  if (orderMissedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${orderMissedKey}`,
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      price: parseInt(product["price"]),
      pid: product["pid"],
      productName: product["productName"],
      amount: parseInt(product["amount"]),
    }
    const productMissedKey = checkColumn(productDTO, [])
    if (productMissedKey) {
      return res.status(400).send({
        success: false,
        message: `麻煩提供 ${productMissedKey}`,
      })
    }
  }

  // Check if discountTypes is valid
  if (!discountTypes) {
    discountTypes = []
  }
  const isValid = isDiscountTypesValid(discountTypes)
  if (isValid === -1) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供折扣類型名稱及折扣",
    })
  } else if (isValid === -2) {
    return res.status(400).send({
      success: false,
      message: "折扣應為正數",
    })
  }

  try {
    // add discountTypes to note
    const newNote = addNewNote(note, discountTypes)
    cleanOrderDTO["note"] = newNote

    // 如果 discountTypes 不存在於資料庫，則新增
    const discountTypeList = await getDiscountTypeList(uid)
    addNewDiscountTypes(discountTypeList, discountTypes, uid)

    if (tagList.length !== 0) {
      addNewTag(tagList, uid)
    }

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
    await updateOrderModel(orderId, cleanOrderDTO)
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
