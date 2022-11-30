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

const addMaterialModel = async (name) => {
  try {
    const docRef = await db.collection("materials").add({
      name: name,
      occurCount: 1,
    })
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}


const updateMaterialCountModel = async (name) => {
  try {
    const snapShot = await db
      .collection("materials")
      .where("name", "==", name)
      .get()
    if (snapShot.empty) {
      return -1
    }
    const docRef = snapShot.docs[0]
    const material = docRef.data()
    const occurCount = material["occurCount"]
    await db.collection("materials").doc(docRef.id).update({
      occurCount: occurCount + 1,
    })
    return 0
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getPredictListModel,
  getMaterialListModel,
  addMaterialModel,
  updateMaterialCountModel,
}
