const { db } = require("../../utils/admin")

const addOrderModel = async (orderDTO) => {
  try {
    const docRef = await db.collection("orders").add(orderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
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

const getOrderListByUserModel = async (uid, startAt, limit) => {
  try {
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
  } catch (error) {
    console.log(error)
  }
}

const getOrderListByEmployeeModel = async (
  uid,
  staffName,
  startAt,
  limit
) => {
  try {
    const docRef = await db.collection("orders")
      .where("uid", "==", uid)
      .where("staffName", "==", staffName)
      .orderBy("timestamp", "desc")
      .startAfter(startAt)
      .limit(limit)
      .get()
    const orderList = []
    docRef.forEach((doc)=>{
      orderList.push(doc.data())
    })
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


module.exports = {
  addOrderModel,
  getOrderModel,
  getOrderListByUserModel,
  getOrderListByEmployeeModel,
  removeOrderModel,
}
