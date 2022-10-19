const auth = require("../../utils/auth")
const { admin } = require("../../utils/admin")
const { getUserProfileModel } = require("../../model/user/profile.model")
const { signUpModel } = require("../../model/user/sign.model")

const signUp = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const email = decodedClaims.email
        const userProfile = await getUserProfileModel(uid)

        // console.log(userProfile.data())

        if (userProfile) {
            return res.send({ success: false, message: "User already exists" })
        }

        console.log(req.body)
        const { firstName, lastName, phoneNumber, howToKnowUs } = req.body
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            howToKnowUs: howToKnowUs,
        }
        console.log(user)
        const isSignUp = await signUpModel(uid, user)
        // 等可以 deploy 再決定要不要加這段
        // if (!isSignUp) {
        //     return res.send({ success: false, message: "Sign Up failed" })
        // }
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}

module.exports = { signUp }
