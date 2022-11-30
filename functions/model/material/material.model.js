const { db } = require("../../utils/admin")

const getPredictListModel = async () => {
  try {
    const snapShot = await db
      .collection("materials")
      .where("occurCount", ">", 9)
      .get()
    const materialList = []
    snapShot.forEach((doc) => {
      const name = doc.data()["name"]
      const id = doc.id
      materialList.push({
        name: name,
        id: id,
      })
    })
    return materialList
  } catch (error) {
    console.log(error)
  }
}

const getMaterialListModel = async () => {
  try {
    const snapShot = await db
      .collection("materials")
      .get()
    const materialList = []
    snapShot.forEach((doc) => {
      const name = doc.data()["name"]
      const id = doc.id
      materialList.push({
        name: name,
        id: id,
      })
    })
    return materialList
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getPredictListModel, getMaterialListModel }
