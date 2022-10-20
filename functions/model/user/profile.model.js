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
        const result = await db.collection("users").doc(uid).set(user)
        console.log("result from createProfileModel : ", result)
        // 等可以看 result 長怎樣再決定要不要加、改這段
        // if (result) {
        //     return true
        // }
        // return false
    } catch (error) {
        console.log(error)
    }
}
const updateProfileModel = async (uid, user) => {
    try {
        const result = await db.collection("users").doc(uid).set(user)
        console.log("result from updateProfileModel : ", result)
        // 等可以看 result 長怎樣再決定要不要加、改這段
        // if (result) {
        //     return true
        // }
        // return false
    } catch (error) {
        console.log(error)
    }
}

module.exports = { getProfileModel, createProfileModel, updateProfileModel }
