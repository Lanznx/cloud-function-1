const { db } = require("../../utils/admin")

const signUpModel = async (uid, user) => {
    try {
        const result = await db.collection("users").doc(uid).set(user)
        // 等可以看 result 長怎樣再決定要不要加、改這段
        // if (result) {
        //     return true
        // }
        // return false
    } catch (error) {
        console.log(error)
    }
}

module.exports = { signUpModel }