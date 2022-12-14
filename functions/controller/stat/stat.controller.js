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
  const statDTO = {
    uid: uid,
    startAt: startAt,
    endAt: endAt,
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
        productName: product.name,
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
          if (p.productName === product.productName) {
            p.revenue += product.price * product.amount
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
module.exports = {
  getProductStat,
}
