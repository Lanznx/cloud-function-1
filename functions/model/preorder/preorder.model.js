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

module.exports = {
  addPreorderModel,
}
