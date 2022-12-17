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
        pid: product["pid"],
        productName: product["name"],
        spec: product["spec"],
        revenue: 0,
        amount: 0,
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
          if (p["pid"] === product["pid"]) {
            p["revenue"] += product["price"] * product["amount"]
            p["amount"] += product["amount"]
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
        pid: product["pid"],
        productName: product["name"],
        spec: product["spec"],
        type: product["type"],
        revenue: 0,
        amount: 0,
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
          if (p["pid"] === product["pid"]) {
            p["revenue"] += product["price"] * product["amount"]
            p["amount"] += product["amount"]
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
            type["amount"] += product["amount"]
          }
        })
        return
      }
      typeRevenueList.push({
        typeName: product["type"],
        revenue: product["revenue"],
        amount: product["amount"],
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
            staff["amount"] += 1
          }
        })
        return
      }
      staffRevenueList.push({
        staffName: order["staffName"],
        revenue: order["totalPrice"],
        amount: 1,
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

const getLineChart = async (req, res) => {
  const { uid } = req.middleware
  let { startAt, endAt, unit } = req.query
  if (!startAt) {
    startAt = Date.now()
  }
  if (!endAt) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    // oneWeekAgo.setHours(0, 0, 0, 0)
    endAt = oneWeekAgo.getTime()
  }
  if (parseInt(startAt) < parseInt(endAt)) {
    const temp = startAt
    startAt = endAt
    endAt = temp
  }

  if (!unit) {
    unit = "hour"
  }
  const statDTO = {
    uid: uid,
    startAt: parseInt(startAt),
    endAt: parseInt(endAt),
    unit: unit,
  }
  try {
    const lineChartList = []
    const orderList = await getOrderListWithGap(statDTO)
    if (orderList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立任何訂單",
      })
    }
    // fill line chart list
    if (unit === "hour") {
      const hours = (startAt - endAt) / 1000 / 60 / 60
      for (let i = 0; i < hours; i++) {
        lineChartList.push({
          time: i,
          revenue: 0,
        })
      }
      orderList.forEach((order) => {
        const absoluteHour = new Date(order["timestamp"]).getHours()
        const currentHour = new Date().getHours()
        const orderHour = currentHour - absoluteHour
        lineChartList.forEach((chart) => {
          if (chart["time"] === orderHour) {
            chart["revenue"] += order["totalPrice"]
          }
        })
      })
    } else if (unit === "day") {
      const days = (startAt - endAt) / 1000 / 60 / 60 / 24
      for (let i = 0; i < days; i++) {
        lineChartList.push({
          time: i,
          revenue: 0,
        })
      }
      orderList.forEach((order) => {
        const absoluteDay = new Date(order["timestamp"]).getDay()
        const currentDay = new Date().getDay()
        const orderDay = currentDay - absoluteDay
        lineChartList.forEach((chart) => {
          if (chart["time"] === orderDay) {
            chart["revenue"] += order["totalPrice"]
          }
        })
      })
    } else if (unit === "week") {
      const weeks = (startAt - endAt) / 1000 / 60 / 60 / 24 / 7
      for (let i = 0; i < weeks; i++) {
        lineChartList.push({
          time: i,
          revenue: 0,
        })
      }
      orderList.forEach((order) => {
        const orderDay = (startAt - order["timestamp"]) / 1000 / 60 / 60 / 24

        let orderWeek = 0
        if (orderDay < 7) {
          orderWeek = 0
        } else if (orderDay < 14) {
          orderWeek = 1
        } else if (orderDay < 21) {
          orderWeek = 2
        } else if (orderDay < 28) {
          orderWeek = 3
        } else if (orderDay < 35) {
          orderWeek = 4
        }
        lineChartList.forEach((chart) => {
          if (chart["time"] === orderWeek) {
            chart["revenue"] += order["totalPrice"]
          }
        })
      })
    }

    if (lineChartList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "您的折線圖資訊為空",
        unit: unit,
        data: lineChartList,
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功取得折線圖資訊",
      unit: unit,
      data: lineChartList,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "取得折線圖資訊時出錯，請聯絡客服",
      err: error,
    })
  }
}


module.exports = {
  getProductStat,
  getTypeStat,
  getStaffStat,
  getLineChart,
}
