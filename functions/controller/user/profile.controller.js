const { checkColumn, isString } = require("../../helper/checkColumn")
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
      return res.status(200).send({
        success: true,
        userProfile: null,
        message: "找不到該個人檔案",
      })
    }

    return res.status(200).send({
      success: true,
      userProfile: userProfile,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "發生錯誤，請聯絡客服",
      err: error,
    })
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
  const missedKey = checkColumn(profileDto, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  } else if (!isString(phoneNumber)) {
    return res.status(400).send({
      success: false,
      message: "電話號碼的型別應為字串",
    })
  }

  try {
    const userProfile = await getProfileModel(uid)

    if (userProfile) {
      return res.status(400).send({
        success: false,
        message: "您已經建立過個人檔案",
      })
    }

    await createProfileModel(uid, profileDto)
    return res.status(201).send({
      success: true,
      message: "建立個人檔案成功",
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "發生錯誤，請聯絡客服",
      err: error,
    })
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
  const missedKey = checkColumn(profileDto, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  } else if (!isString(phoneNumber)) {
    return res.status(400).send({
      success: false,
      message: "電話號碼的型別應為字串",
    })
  }

  try {
    const userProfile = await getProfileModel(uid)

    if (!userProfile) {
      return res.status(400).send({
        success: false,
        message: "您尚未建立個人檔案",
      })
    }

    await updateProfileModel(uid, profileDto)
    return res.status(200).send({
      success: true,
      message: "更新成功",
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "發生錯誤，請聯絡客服",
      err: error,
    })
  }
}
module.exports = { getProfile, updateProfile, createProfile }
