const { db } = require("../../utils/admin")

const addFormModel = async (preorderDTO) => {
  try {
    const docRef = await db.collection("preorder-forms").add(preorderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
    return -1
  }
}

const updateFormModel = async (uid, preorderDTO) => {
  try {
    const docRef = await db
      .collection("preorder-forms")
      .where("uid", "==", uid)
      .get()
    const preorderID = docRef.docs[0].id
    await db.collection("preorder-forms")
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
      .collection("preorder-forms")
      .where("uid", "==", uid)
      .get()
    if (docRef.empty) {
      return -1
    }
    const form = {
      "preorder-formId": docRef.docs[0].id,
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

const disableFormModel = async (uid) => {
  try {
    const docRef = await db
      .collection("preorder-forms")
      .where("uid", "==", uid)
      .get()
    const preorderID = docRef.docs[0].id
    await db.collection("preorder-forms")
      .doc(preorderID)
      .update({
        enable: false,
      })

    return preorderID
  } catch (error) {
    console.log(error)
    return -1
  }
}

const enableFormModel = async (uid) => {
  try {
    const docRef = await db
      .collection("preorder-forms")
      .where("uid", "==", uid)
      .get()
    const preorderID = docRef.docs[0].id
    await db.collection("preorder-forms")
      .doc(preorderID)
      .update({
        enable: true,
      })

    return preorderID
  } catch (error) {
    console.log(error)
    return -1
  }
}

module.exports = {
  addFormModel,
  updateFormModel,
  getFormModel,
  disableFormModel,
  enableFormModel,
}
