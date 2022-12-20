// const checkColumn = require("../../helper/checkColumn")
const {
  getPreorderList,
  getPreorderModel,
  updatePreorderModel,
  removePreorderModel,
} = require("../../model/preorder/user.model")

const get = async (req, res) => {
  const { uid } = req.middleware
  let { startAt, endAt } = req.query

  if (!startAt) {
    startAt = new Date().getTime()
  }
  if (!endAt) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    endAt = oneWeekAgo.getTime()
  }
  if (startAt < endAt) {
    const temp = endAt
    endAt = startAt
    startAt = temp
  }

  const gapDTO = {
    uid: uid,
    startAt: parseInt(startAt),
    endAt: parseInt(endAt),
  }

  try {
    const preorderList = await getPreorderList(gapDTO)
    if (preorderList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "成功獲取訂單",
        preorderList: preorderList,
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功獲取訂單",
      preorderList: preorderList,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "獲取訂單失敗",
      err: error,
    })
  }
}

const finish = async (req, res) => {
  const { uid } = req.middleware
  const { preorderId } = req.params

  if (!preorderId) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供 preorderId",
    })
  }

  try {
    const preorder = await getPreorderModel(preorderId)
    if (preorder === -2) {
      return res.status(400).send({
        success: false,
        message: "訂單不存在",
      })
    } else if (preorder === -1) {
      return res.status(500).send({
        success: false,
        message: "取得訂單時資料庫錯誤",
      })
    } else if (preorder["isPicked"] === true) {
      return res.status(400).send({
        success: false,
        message: "訂單已完成",
      })
    } else if (preorder["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "你沒有權限修改此訂單",
      })
    }
    const preorderDTO = {
      isPicked: true,
    }
    const result = await updatePreorderModel(preorderId, preorderDTO)
    if (result === -1) {
      return res.status(500).send({
        success: false,
        message: "更新訂單時資料庫錯誤",
      })
    }
    return res.status(200).send({
      success: true,
      message: "更新訂單狀態完成",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "訂單完成失敗，請稍後再試",
      err: error,
    })
  }
}

const remove = async (req, res) => {
  const { uid } = req.middleware
  const { preorderId } = req.params

  if (!preorderId) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供 preorderId",
    })
  }

  try {
    const preorder = await getPreorderModel(preorderId)
    if (preorder === -2) {
      return res.status(400).send({
        success: false,
        message: "訂單不存在",
      })
    }
    if (preorder === -1) {
      return res.status(500).send({
        success: false,
        message: "取得訂單時資料庫錯誤",
      })
    }
    if (preorder["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "你沒有權限刪除此訂單",
      })
    }

    const result = await removePreorderModel(preorderId)
    if (result === -1) {
      return res.status(500).send({
        success: false,
        message: "刪除訂單時資料庫錯誤",
      })
    }
    return res.status(200).send({
      success: true,
      message: "刪除訂單成功",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "刪除訂單失敗，請稍後再試",
      err: error,
    })
  }
}


module.exports = {
  get,
  finish,
  remove,
}
