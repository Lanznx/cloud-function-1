const { db } = require("../../utils/admin")

const addTagModel = async (tagDTO) => {
  try {
    const docRef = await db.collection("tags").add(tagDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}

const getTagModel = async (uid, name) => {
  try {
    const snapShot = await db
      .collection("tags")
      .where("name", "==", name)
      .where("uid", "==", uid)
      .get()
    if (snapShot.empty) {
      return -1
    }
    let tag = {}
    snapShot.forEach((doc) => {
      tag = doc.data()
    })
    return tag
  } catch (error) {
    console.log(error)
  }
}


const getTagListModel = async (uid) => {
  try {
    const snapShot = await db.collection("tags").where("uid", "==", uid).get()
    if (snapShot.empty) {
      return -1
    }
    const tagList = []
    snapShot.forEach((doc) => {
      const data = doc.data()
      tagList.push(data["name"])
    })
    return tagList
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addTagModel,
  getTagListModel,
  getTagModel,
}
