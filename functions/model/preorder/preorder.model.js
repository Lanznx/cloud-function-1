const { db } = require("../../utils/admin")

const addPreorderModel = async (preorderDTO) => {
  try {
    const docRef = await db.collection("preorders").add(preorderDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
    return -1
  }
}

const updatePreorderModel = async (uid, preorderDTO) => {
  try {
    const docRef = await db
      .collection("preorders")
      .where("uid", "==", uid)
      .get()
    const preorderID = docRef.docs[0].id

    return preorderID
  } catch (error) {
    console.log(error)
    return -1
  }
}

const getPreorderModel = async (uid) => {
  try {
    const docRef = await db
      .collection("preorders")
      .where("uid", "==", uid)
      .get()
    if (docRef.empty) {
      return -1
    }
    const preorder = docRef.docs[0].data()

    return preorder
  } catch (error) {
    console.log(error)
    return -2
  }
}

module.exports = {
  addPreorderModel,
  updatePreorderModel,
  getPreorderModel,
}
