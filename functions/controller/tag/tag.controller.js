const { checkColumn } = require("../../helper/checkColumn")
const {
  getTagListModel,
  addTagModel,
  getTagModel,
  deleteTagModel,
} = require("../../model/tag/tag.model")

const getAll = async (req, res) => {
  try {
    const { uid } = req.middleware
    const result = await getTagListModel(uid)
    if (result === -1) {
      return res.status(200).send({
        success: true,
        message: "標籤列表為空",
        data: [],
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功取得標籤列表",
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
  const tagDTO = {
    name: name,
    uid: uid,
  }
  const missedKey = checkColumn(tagDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  }

  try {
    const tag = await getTagModel(uid, name)
    if (tag !== -1) {
      return res.status(400).send({
        success: false,
        message: "標籤已存在",
      })
    }
    const result = await addTagModel(tagDTO)
    return res.status(200).send({
      success: true,
      message: "成功加入標籤",
      data: result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "加入標籤失敗，請聯絡客服",
      err: error,
    })
  }
}

const remove = async (req, res) =>{
  const { uid } = req.middleware
  const { name } = req.query
  const tagDTO = {
    uid: uid,
    name: name,
  }
  const missedKey = checkColumn(tagDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  }
  const tag = await getTagModel(uid, name)
  if (tag === -1) {
    return res.status(400).send({
      success: false,
      message: "標籤不存在",
    })
  }
  try {
    deleteTagModel(tagDTO)
    return res.status(200).send({
      success: true,
      message: "成功刪除標籤",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "刪除標籤失敗，請聯絡客服",
      err: error,
    })
  }
}

module.exports = {
  getAll,
  add,
  remove,
}
