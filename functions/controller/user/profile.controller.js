const auth = require("../../utils/auth")
const { admin } = require("../../utils/admin")
const {
    getProfileModel,
    updateProfileModel,
    createProfileModel,
} = require("../../model/user/profile.model")

const getProfile = async (req, res) => {
    console.log("this is getPROFILE")
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const userProfile = await getProfileModel(uid)

        // if not found user, userProfile will be send as undefined
        if (!userProfile) {
            return res.send({
                success: false,
                userProfile: null,
                message: "the profile is empty",
            })
        }

        return res.send({
            success: true,
            userProfile: userProfile,
        })
    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "unknown error" })
    }
}

const createProfile = async (req, res) => {
    console.log("this si create")
    try {
        // TO-DO 1:
        // middleware to auth
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const email = decodedClaims.email
        const userProfile = await getProfileModel(uid)

        if (userProfile) {
            return res.send({
                success: false,
                message: "User already has profile",
            })
        }

        console.log(req.body)

        // TO-DO 2:
        // 確認參數都有在 body 的 interceptor

        const { firstName, lastName, phoneNumber, howToKnowUs } = req.body
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            howToKnowUs: howToKnowUs,
        }
        console.log(user)
        await createProfileModel(uid, user)
        // const isSignUp = await updateProfileModel(uid, user)
        // 等可以 deploy 再決定要不要加這段
        // if (!isSignUp) {
        //     return res.send({ success: false, message: "Sign Up failed" })
        // }
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}


const updateProfile = async (req, res) => {
    try {
        // TO-DO 1:
        // middleware to auth
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid
        const email = decodedClaims.email
        const userProfile = await getProfileModel(uid)

        // console.log(userProfile.data())

        if (!userProfile) {
            return res.send({ success: false, message: "User does not exist" })
        }

        console.log(req.body)

        // TO-DO 2:
        // 確認參數都有在 body 的 interceptor

        const { firstName, lastName, phoneNumber, howToKnowUs } = req.body
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            howToKnowUs: howToKnowUs,
        }
        console.log(user)
        await updateProfileModel(uid, user)
        // const isSignUp = await updateProfileModel(uid, user)
        // 等可以 deploy 再決定要不要加這段
        // if (!isSignUp) {
        //     return res.send({ success: false, message: "Sign Up failed" })
        // }
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}
module.exports = { getProfile, updateProfile, createProfile }
