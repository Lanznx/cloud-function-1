const { checkColumn } = require("../../helper/checkColumn")
const {
  getTypeListModel,
  addTypeModel,
  getTypeModel,
  deleteTypeModel,
} = require("../../model/type/type.model")

const getAll = async (req, res) => {
  try {
    const { uid } = req.middleware
    const result = await getTypeListModel(uid)
    if (result === -1) {
      return res.status(200).send({
        success: true,
        message: "種類列表為空",
        data: [],
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功取得種類列表",
      data: result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "伺服器錯誤，請聯絡客服",
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

const remove = async (req, res) =>{
  const { uid } = req.middleware
  const { name } = req.query
  if (!name) {
    return res.status(400).send({
      success: false,
      message: "請提供種類名稱",
    })
  }
  try {
    const type = await getTypeModel(uid, name)
    if (type === -1) {
      return res.status(400).send({
        success: false,
        message: "種類不存在",
      })
    }
    deleteTypeModel(uid, name)
    return res.status(200).send({
      success: true,
      message: "成功刪除種類",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "刪除種類失敗，請聯絡客服",
      err: error,
    })
  }
}

module.exports = {
  getAll,
  add,
  remove,
}
