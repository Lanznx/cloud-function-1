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
const getPreorderList = async (gapDTO) => {
  const { uid, startAt, endAt } = gapDTO

  try {
    const docRef = await db.collection("preorders")
      .where("uid", "==", uid)
      .orderBy("createTime", "desc")
      .where("createTime", "<=", startAt)
      .where("createTime", ">=", endAt)
      .get()
    const preorderList = []
    docRef.forEach((doc)=>{
      const orderDTO = {
        preorderId: doc.id,
        ...doc.data(),
      }
      delete orderDTO["uid"]
      preorderList.push(orderDTO)
    })
    return preorderList
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  addPreorderModel,
  getPreorderList,
}
