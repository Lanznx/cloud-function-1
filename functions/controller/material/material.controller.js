const {
  getMaterialListModel,
  getPredictListModel,
  // addMaterialModel,
  // updateMaterialCountModel,
} = require("../../model/material/material.model")
const {
  getUserMaterialListModel,
} = require("../../model/material/userMaterial.model")

const getAllMaterial = async (req, res) => {
  try {
    const materialList = await getMaterialListModel()
    return res.status(200).send({
      success: true,
      materialList: materialList,
    })
  } catch (error) {
    console.log(error)
  }
}

const getPredictMaterial = async (req, res) => {
  try {
    const materialList = await getPredictListModel()
    return res.status(200).send({
      success: true,
      materialList: materialList,
    })
  } catch (error) {
    console.log(error)
  }
}

const getUserMaterial = async (req, res) => {
  try {
    const { uid } = req.middleware
    const userMaterialList = await getUserMaterialListModel(uid)
    if (userMaterialList.length === 0) {
      return res.status(200).send({
        success: false,
        userMaterialList: [],
        message: "this user has no material",
      })
    }
    return res.status(200).send({
      success: true,
      userMaterialList: userMaterialList,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllMaterial,
  getPredictMaterial,
  getUserMaterial,
}
