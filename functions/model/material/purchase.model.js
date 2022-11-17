const { db } = require("../../utils/admin")

const addPurchaseOrder = async (purchaseOrderDTO)=>{
  try {
    const docRef = await db.collection("material-record").add(purchaseOrderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}

const deletePurchaseOrder = async (orderId, materialId, isDeleteOrder)=>{
  try {
    const docRef = await db.collection("material-record").doc(orderId).get()
    if (!docRef.exists) {
      return -1
    }

    if (isDeleteOrder) {
      await db.collection("material-record").doc(orderId).delete()
      return 0
    }

    const materialList = docRef.data().materialList
    const isMaterialExist = materialList.find((material)=>{
      return material.id === materialId
    })
    if (!isMaterialExist) {
      return -2
    }

    const updatedArray = materialList.filter((item)=>{
      return item.id !== materialId
    })
    await db.collection("material-record").doc(orderId).update({
      materialList: updatedArray,
    })
    if (updatedArray.length === 0) {
      await db.collection("material-record").doc(orderId).delete()
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports={ addPurchaseOrder, deletePurchaseOrder }
