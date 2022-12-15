const { getProductListModel } = require("../../model/product/product.model")
const {
  getOrderListWithGap,
} = require("../../model/product/sell.model")

const getProductStat = async (req, res) => {
  const { uid } = req.middleware
  let { startAt, endAt } = req.query
  if (!startAt) {
    startAt = Date.now()
  }
  if (!endAt) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    oneWeekAgo.setHours(0, 0, 0, 0)
    endAt = oneWeekAgo.getTime()
  }
  if (parseInt(startAt) < parseInt(endAt)) {
    const temp = startAt
    startAt = endAt
    endAt = temp
  }
  const statDTO = {
    uid: uid,
    startAt: parseInt(startAt),
    endAt: parseInt(endAt),
  }
  try {
    const productRevenueList = []
    const productList = await getProductListModel(uid)
    if (productList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立任何商品",
      })
    }
    productList.forEach((product) => {
      productRevenueList.push({
        productName: product["name"],
        revenue: 0,
      })
    })
    const orderList = await getOrderListWithGap(statDTO)
    if (orderList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立任何訂單",
      })
    }

    orderList.forEach((order) => {
      order["productList"].forEach((product) => {
        productRevenueList.forEach((p) => {
          if (p["productName"] === product["productName"]) {
            p["revenue"] += product["price"] * product["amount"]
          }
        })
      })
    })

    if (productRevenueList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "商品統計資料為空",
        data: productRevenueList,
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功取得商品統計資料",
      data: productRevenueList,
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "伺服器錯誤，請聯絡客服",
      err: error,
    })
  }
}

const getTypeStat = async (req, res) => {
  const { uid } = req.middleware
  let { startAt, endAt } = req.query
  if (!startAt) {
    startAt = Date.now()
  }
  if (!endAt) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    oneWeekAgo.setHours(0, 0, 0, 0)
    endAt = oneWeekAgo.getTime()
  }
  if (parseInt(startAt) < parseInt(endAt)) {
    const temp = startAt
    startAt = endAt
    endAt = temp
  }
  const statDTO = {
    uid: uid,
    startAt: parseInt(startAt),
    endAt: parseInt(endAt),
  }
  try {
    const typeRevenueList = []
    const productRevenueList = []
    const productList = await getProductListModel(uid)
    if (productList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立任何商品",
      })
    }
    // init product revenue list
    productList.forEach((product) => {
      productRevenueList.push({
        productName: product["name"],
        type: product["type"],
        revenue: 0,
      })
    })
    const orderList = await getOrderListWithGap(statDTO)
    if (orderList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立任何訂單",
      })
    }
    // fill product revenue list
    orderList.forEach((order) => {
      order["productList"].forEach((product) => {
        productRevenueList.forEach((p) => {
          if (p["productName"] === product["productName"]) {
            p["revenue"] += product["price"] * product["amount"]
          }
        })
      })
    })

    // fill type revenue list
    productRevenueList.forEach((product) => {
      const isTypeExist = typeRevenueList
        .find((type) => type["typeName"] === product["type"])
      if (isTypeExist) {
        typeRevenueList.forEach((type) => {
          if (type["typeName"] === product["type"]) {
            type["revenue"] += product["revenue"]
          }
        })
        return
      }
      typeRevenueList.push({
        typeName: product["type"],
        revenue: product["revenue"],
      })
    })
    if (typeRevenueList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "類型統計資料為空",
        data: typeRevenueList,
      })
    }

    return res.status(200).send({
      success: true,
      message: "成功取得類型統計資料",
      data: typeRevenueList,
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "伺服器錯誤，請聯絡客服",
      err: error,
    })
  }
}

const getStaffStat = async (req, res) => {
  const { uid } = req.middleware
  let { startAt, endAt } = req.query
  if (!startAt) {
    startAt = Date.now()
  }
  if (!endAt) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    oneWeekAgo.setHours(0, 0, 0, 0)
    endAt = oneWeekAgo.getTime()
  }
  if (parseInt(startAt) < parseInt(endAt)) {
    const temp = startAt
    startAt = endAt
    endAt = temp
  }
  const statDTO = {
    uid: uid,
    startAt: parseInt(startAt),
    endAt: parseInt(endAt),
  }
  try {
    const staffRevenueList = []
    const orderList = await getOrderListWithGap(statDTO)
    if (orderList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立任何訂單",
      })
    }
    // fill staff revenue list
    orderList.forEach((order) => {
      const isStaffExist = staffRevenueList
        .find((staff) => staff["staffName"] === order["staffName"])
      if (isStaffExist) {
        staffRevenueList.forEach((staff) => {
          if (staff["staffName"] === order["staffName"]) {
            staff["revenue"] += order["totalPrice"]
          }
        })
        return
      }
      staffRevenueList.push({
        staffName: order["staffName"],
        revenue: order["totalPrice"],
      })
    }
    )
    if (staffRevenueList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "員工統計資料為空",
        data: staffRevenueList,
      })
    }

    return res.status(200).send({
      success: true,
      message: "成功取得員工統計資料",
      data: staffRevenueList,
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "伺服器錯誤，請聯絡客服",
      err: error,
    })
  }
}
module.exports = {
  getProductStat,
  getTypeStat,
  getStaffStat,
}
