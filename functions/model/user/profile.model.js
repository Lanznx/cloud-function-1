const { db } = require("../../utils/admin")


const getUserProfileModel = async (uid) => {
    try {
        const userProfile = await db.collection("users").doc(uid).get()
        return userProfile.data()
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { getUserProfileModel }