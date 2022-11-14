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
        amount: userMaterial["amout"],
      })
    })

    return userMaterialList
  } catch (error) {
    console.log(error)
  }
}


module.exports = { getUserMaterialListModel }
