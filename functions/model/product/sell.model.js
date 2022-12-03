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

module.exports = {
  addOrderModel,
  getOrderModel,
}
