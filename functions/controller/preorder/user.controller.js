// const checkColumn = require("../../helper/checkColumn")
const { getPreorderList } = require("../../model/preorder/user.model")

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


module.exports = {
  get,
}
