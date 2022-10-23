const {
    getProfileModel,
    updateProfileModel,
    createProfileModel,
} = require("../../model/user/profile.model")

const getProfile = async (req, res) => {
    try {
        const { uid } = req.middleware
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
    try {
        const { uid, email } = req.middleware
        const userProfile = await getProfileModel(uid)

        if (userProfile) {
            return res.send({
                success: false,
                message: "User already has profile",
            })
        }

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
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}


const updateProfile = async (req, res) => {
    try {
        const { uid, email } = req.middleware
        const userProfile = await getProfileModel(uid)

        if (!userProfile) {
            return res.send({ success: false, message: "User does not exist" })
        }

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
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}
module.exports = { getProfile, updateProfile, createProfile }
