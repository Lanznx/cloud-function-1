const auth = require("../../utils/auth")
const {admin, db} = require("../../utils/admin")

const profile = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const userProfile = await db.collection("users").doc(uid).get()

        // if not found user, userProfile.data() will be send as ''
        return res.send({
            success: true,
            userProfile: userProfile.data(),
        })
    } catch (error) {
        return res.send({success: false, message: "unknown error"})
    }
}

module.exports = profile
