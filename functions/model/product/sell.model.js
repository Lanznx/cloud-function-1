const { db } = require("../../utils/admin")

const addOrderModel = async (orderDTO) => {
  try {
    const docRef = await db.collection("orders").add(orderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
    return -1
  }
}

const getOrderModel = async (orderId) => {
  try {
    const docRef = await db.collection("orders").doc(orderId).get()
    if (!docRef.exists) {
      return -1
    }
    return docRef.data()
  } catch (error) {
    console.log(error)
  }
}

const getOrderListWithPagination = async (paginationDTO) => {
  const { uid, startAt, limit, staffName } = paginationDTO
  try {
    if (!staffName) {
      const docRef = await db.collection("orders")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .startAfter(startAt)
        .limit(limit)
        .get()
      const orderList = []
      docRef.forEach((doc)=>{
        orderList.push({
          orderId: doc.id,
          ...doc.data(),
        })
      })
      return orderList
    }
    const docRef = await db.collection("orders")
      .where("uid", "==", uid)
      .where("staffName", "==", staffName)
      .orderBy("timestamp", "desc")
      .startAfter(startAt)
      .limit(limit)
      .get()
    const orderList = []
    docRef.forEach((doc)=>{
      orderList.push({
        orderId: doc.id,
        ...doc.data(),
      })
    })
    if (!orderList) {
      return []
    }
    return orderList
  } catch (error) {
    console.log(error)
  }
}

const getOrderListWithGap = async (gapDTO) => {
  const { uid, startAt, endAt, staffName } = gapDTO

  try {
    if (!staffName) {
      const docRef = await db.collection("orders")
        .where("uid", "==", uid)
        .where("timestamp", "<=", startAt)
        .where("timestamp", ">=", endAt)
        .orderBy("timestamp", "desc")
        .get()
      const orderList = []
      docRef.forEach((doc)=>{
        orderList.push(doc.data())
      })
      return orderList
    }

    const docRef = await db.collection("orders")
      .where("uid", "==", uid)
      .where("staffName", "==", staffName)
      .orderBy("timestamp", "desc")
      .where("timestamp", "<=", startAt)
      .where("timestamp", ">=", endAt)
      .get()
    const orderList = []
    docRef.forEach((doc)=>{
      orderList.push(doc.data())
    })
    if (!orderList) {
      return []
    }
    return orderList
  } catch (error) {
    console.log(error)
  }
}


const removeOrderModel = async (orderId) => {
  try {
    await db.collection("orders").doc(orderId).delete()
  } catch (error) {
    console.log(error)
  }
}

const updateOrderModel = async (orderId, orderDTO) =>{
  try {
    await db.collection("orders").doc(orderId).update(orderDTO)
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  addOrderModel,
  getOrderModel,
  getOrderListWithPagination,
  getOrderListWithGap,
  removeOrderModel,
  updateOrderModel,
}
