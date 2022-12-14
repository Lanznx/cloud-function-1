const { db } = require("../../utils/admin")

const addDiscountType = async (discountTypeDTO) => {
  try {
    const decRef = await db
      .collection("discountTypes")
      .add(discountTypeDTO)
    return decRef.id
  } catch (error) {
    console.log(error)
  }
}

const getDiscountType = async (discountTypeId) => {
  try {
    const docRef = await db
      .collection("discountTypes")
      .doc(discountTypeId)
      .get()
    if (!docRef.exists) {
      return -1
    }
    return docRef.data()
  } catch (error) {
    console.log(error)
  }
}

const getDiscountTypeList = async (uid) => {
  try {
    const docRef = await db
      .collection("discountTypes")
      .where("uid", "==", uid)
      .get()
    if (docRef.empty) {
      return -1
    }
    const discountTypeList = []
    docRef.forEach((doc) => {
      discountTypeList.push({
        discountTypeId: doc.id,
        note: doc.data().note,
        name: doc.data().name,
        discount: doc.data().discount,
      })
    })
    return discountTypeList
  } catch (error) {
    console.log(error)
  }
}

const deleteDiscountType = async (discountTypeId) => {
  try {
    await db.collection("discountTypes").doc(discountTypeId).delete()
    return 0
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addDiscountType,
  getDiscountType,
  getDiscountTypeList,
  deleteDiscountType,
}
