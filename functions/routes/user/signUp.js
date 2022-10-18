const auth = require("../../utils/auth")
const {admin, db} = require("../../utils/admin")

const signUp = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const email = decodedClaims.email
        const userProfile = await db.collection("users").doc(uid).get()

        // console.log(userProfile.data())

        if (userProfile.data()) {
            return res.send({success: false, message: "User already exists"})
        }

        console.log(req.body)
        const {firstName, lastName, phoneNumber, howToKnowUs} = req.body
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            howToKnowUs: howToKnowUs,
        }
        console.log(user)
        await db.collection("users").doc(uid).set(user)
        return res.send({success: true})
    } catch (error) {
        return res.send({success: false, message: "unknown error"})
    }
}

module.exports = signUp
