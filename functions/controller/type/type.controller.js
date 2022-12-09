const { checkColumn } = require("../../helper/checkColumn")
const {
  getTypeListModel,
  addTypeModel,
  getTypeModel,
} = require("../../model/type/type.model")

const getAll = async (req, res) => {
  try {
    const { uid } = req.middleware
    const result = await getTypeListModel(uid)
    if (result === -1) {
      return res.status(200).send({
        success: true,
        message: "type list is empty",
        data: [],
      })
    }
    return res.status(200).send({
      success: true,
      message: "get purchase order list successfully",
      data: result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "get purchase order list failed",
      err: error,
    })
  }
}

const add = async (req, res) => {
  const { uid } = req.middleware
  const { name } = req.body
  const typeDTO = {
    name: name,
    uid: uid,
  }
  const missedKey = checkColumn(typeDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  }

  try {
    const type = await getTypeModel(uid, name)
    if (type !== -1) {
      return res.status(400).send({
        success: false,
        message: "種類已存在",
      })
    }
    const result = await addTypeModel(typeDTO)
    return res.status(200).send({
      success: true,
      message: "成功加入種類",
      data: result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "加入種類失敗，請聯絡客服",
      err: error,
    })
  }
}

module.exports = {
  getAll,
  add,
}
