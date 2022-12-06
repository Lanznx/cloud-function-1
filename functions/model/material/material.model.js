const { db } = require("../../utils/admin")


const getMaterialListModel = async () => {
  try {
    const snapShot = await db.collection("materials").get()
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

module.exports = { getMaterialListModel }
