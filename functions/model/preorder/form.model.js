const { db } = require("../../utils/admin")

const addFormModel = async (preorderDTO) => {
  try {
    const docRef = await db.collection("preorders").add(preorderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
    return -1
  }
}

const updateFormModel = async (uid, preorderDTO) => {
  try {
    const docRef = await db
      .collection("preorders")
      .where("uid", "==", uid)
      .get()
    const preorderID = docRef.docs[0].id
    await db.collection("preorders")
      .doc(preorderID)
      .update(preorderDTO)

    return preorderID
  } catch (error) {
    console.log(error)
    return -1
  }
}

const getFormModel = async (uid) => {
  try {
    const docRef = await db
      .collection("preorders")
      .where("uid", "==", uid)
      .get()
    if (docRef.empty) {
      return -1
    }
    const form = {
      "preorder-form": docRef.docs[0].id,
      "enable": docRef.docs[0].data().enable,
      "storeName": docRef.docs[0].data().storeName,
      "productList": docRef.docs[0].data().productList,
    }

    return form
  } catch (error) {
    console.log(error)
    return -2
  }
}

module.exports = {
  addFormModel,
  updateFormModel,
  getFormModel,
}
