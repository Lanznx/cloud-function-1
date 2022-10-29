// const checkColumn = require("../../helper/checkColumn")
const { getMaterialListModel } = require("../../model/material/material.model")

const getMaterial = async (req, res) => {
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

module.exports = { getMaterial }
