const { db } = require("../../utils/admin")


const getProfileModel = async (uid) => {
  try {
    const userProfile = await db.collection("users").doc(uid).get()
    return userProfile.data()
  } catch (error) {
    console.log(error)
  }
}


const createProfileModel = async (uid, user) => {
  try {
    await db.collection("users").doc(uid).set(user)
  } catch (error) {
    console.log(error)
  }
}
const updateProfileModel = async (uid, user) => {
  try {
    await db.collection("users").doc(uid).set(user)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getProfileModel, createProfileModel, updateProfileModel }
