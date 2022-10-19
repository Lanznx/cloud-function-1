const auth = require("../../utils/auth")
const { admin } = require("../../utils/admin")
const getUserProfileModel = require("../../model/user/profile.model")

const getUserProfile = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const userProfile = await getUserProfileModel(uid)

        // if not found user, userProfile.data() will be send as ''
        return res.send({
            success: true,
            userProfile: userProfile,
        })
    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "unknown error" })
    }
}

module.exports = { getUserProfile }
