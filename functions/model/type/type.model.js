const { db } = require("../../utils/admin")

const addTypeModel = async (typeDTO) => {
  try {
    const docRef = await db.collection("types").add(typeDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}

const getTypeModel = async (uid, name) => {
  try {
    const snapShot = await db
      .collection("types")
      .where("name", "==", name)
      .where("uid", "==", uid)
      .get()
    if (snapShot.empty) {
      return -1
    }
    let type = {}
    snapShot.forEach((doc) => {
      type = doc.data()
    })
    return type
  } catch (error) {
    console.log(error)
  }
}


const getTypeListModel = async (uid) => {
  try {
    const snapShot = await db.collection("types").where("uid", "==", uid).get()
    if (snapShot.empty) {
      return -1
    }
    const typeList = []
    snapShot.forEach((doc) => {
      const data = doc.data()
      typeList.push(data["name"])
    })
    return typeList
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addTypeModel,
  getTypeListModel,
  getTypeModel,
}
