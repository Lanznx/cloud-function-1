const { db } = require("../../utils/admin")

const getUserMaterialListModel = async (uid) => {
  try {
    const snapShot = await db
      .collection("user-materials")
      .where( "uid", "==", uid )
      .get()

    const userMaterialList = []
    snapShot.forEach((doc) => {
      const userMaterial = doc.data()
      const materialId = doc.id
      userMaterialList.push({
        materialId: materialId,
        materialName: userMaterial["materialName"],
        amount: userMaterial["amount"],
      })
    })

    return userMaterialList
  } catch (error) {
    console.log(error)
  }
}

const updateUserMaterialModel = async (material, uid) => {
  try {
    const snapShot = await db
      .collection("user-materials")
      .where("materialId", "==", material["id"])
      .get()

    if (snapShot.empty) {
      await db.collection("user-materials").add({
        uid: uid,
        materialName: material["name"],
        amount: material["amountChange"],
        materialId: material["id"],
      })
      return 0
    }

    const docRef = snapShot.docs[0]
    const userMaterial = docRef.data()
    const amount = userMaterial["amount"]
    const newAmount = amount + material["amountChange"]

    if (newAmount < 0) {
      return -2
    }

    await db.collection("user-materials").doc(docRef.id).update({
      amount: newAmount,
    })

    return 0
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  getUserMaterialListModel,
  updateUserMaterialModel,
}
