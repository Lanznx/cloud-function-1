const { db } = require("../../utils/admin")

const addPurchaseOrder = async (purchaseOrderDTO)=>{
  try {
    const docRef = await db.collection("material-record").add(purchaseOrderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}
module.exports={ addPurchaseOrder }
