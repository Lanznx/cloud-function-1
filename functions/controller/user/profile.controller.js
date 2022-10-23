const checkColumn = require("../../helper/checkColumn")
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
  const { firstName, lastName, phoneNumber, howToKnowUs } = req.body
  const { uid, email } = req.middleware
  const profileDto = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    howToKnowUs: howToKnowUs,
    email: email,
  }
  const missedKey = checkColumn(profileDto)
  if (missedKey) {
    return res.send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  }

  try {
    const userProfile = await getProfileModel(uid)

    if (userProfile) {
      return res.send({
        success: false,
        message: "User already has profile",
      })
    }

    await createProfileModel(uid, profileDto)
    return res.send({ success: true })
  } catch (error) {
    return res.send({ success: false, message: "unknown error" })
  }
}


const updateProfile = async (req, res) => {
  const { firstName, lastName, phoneNumber, howToKnowUs } = req.body
  const { uid, email } = req.middleware
  const profileDto = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    howToKnowUs: howToKnowUs,
    email: email,
  }
  const missedKey = checkColumn(profileDto)
  if (missedKey) {
    return res.send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  }

  try {
    const userProfile = await getProfileModel(uid)

    if (!userProfile) {
      return res.send({ success: false, message: "User does not exist" })
    }

    await updateProfileModel(uid, profileDto)
    return res.send({ success: true })
  } catch (error) {
    return res.send({ success: false, message: "unknown error" })
  }
}
module.exports = { getProfile, updateProfile, createProfile }
