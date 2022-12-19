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
    const preorderID = docRef.docs[0].id
    if (!preorderID) {
      return -1
    }
    return preorderID
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
