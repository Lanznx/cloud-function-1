const { db } = require("../../utils/admin")

const addStaffModel = async (staffDTO) => {
  try {
    const docRef = await db.collection("staff").add(staffDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}

const getStaffModel = async (sid) => {
  try {
    const docRef = await db.collection("staff").doc(sid).get()
    if (!docRef.exists) {
      return -1
    }
    return docRef.data()
  } catch (error) {
    console.log(error)
  }
}

const getAllStaffModel = async (uid) => {
  try {
    const docRef = await db.collection("staff").where("uid", "==", uid).get()
    const staffList = []
    docRef.forEach((doc)=>{
      staffList.push({
        sid: doc.id,
        ...doc.data(),
      })
    })
    return staffList
  } catch (error) {
    console.log(error)
  }
}

const updateStaffModel = async (sid, staffDTO) => {
  try {
    await db.collection("staff").doc(sid).update(staffDTO)
  } catch (error) {
    console.log(error)
  }
}

const deleteStaffModel = async (sid) => {
  try {
    await db.collection("staff").doc(sid).delete()
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  addStaffModel,
  getStaffModel,
  getAllStaffModel,
  updateStaffModel,
  deleteStaffModel,
}
