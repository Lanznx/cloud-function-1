const { checkColumn } = require("../../helper/checkColumn")
const {
  addDiscountType,
  getDiscountTypeList,
  deleteDiscountType,
  getDiscountType,
} = require("../../model/discountType/discountType.model")

const add = async (req, res) => {
  const { uid } = req.middleware
  const { name, discount, note } = req.body
  const discountTypeDTO = {
    uid: uid,
    name: name,
    discount: parseInt(discount),
    note: note,
  }
  const discountTypeMissedKey = checkColumn(discountTypeDTO, ["note"])
  if (discountTypeMissedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${discountTypeMissedKey}`,
    })
  }
  try {
    // 確認是否有相同名稱的折扣類型
    const currentDiscountTypeList = await getDiscountTypeList(uid)
    if (currentDiscountTypeList !== -1) {
      for (let i = 0; i < currentDiscountTypeList.length; i++) {
        const currentDiscountType = currentDiscountTypeList[i]
        if (currentDiscountType["name"] === name) {
          return res.status(400).send({
            success: false,
            message: "已有相同名稱的折扣類型",
          })
        }
      }
    }
    const discountTypeId = await addDiscountType(discountTypeDTO)
    return res.status(200).send({
      success: true,
      message: "成功新增折扣類型",
      discountTypeId: discountTypeId,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "新增折扣類型失敗，請聯絡客服",
      err: error,
    })
  }
}

const get = async (req, res) => {
  const { uid } = req.middleware
  try {
    const discountTypeList = await getDiscountTypeList(uid)
    if (discountTypeList === -1) {
      return res.status(200).send({
        success: true,
        message: "您沒有任何折扣類型",
        discountTypeList: [],
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功取得折扣類型",
      discountTypeList: discountTypeList,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "取得折扣類型失敗，請聯絡客服",
      err: error,
    })
  }
}

const remove = async (req, res) => {
  const { uid } = req.middleware
  const { discountTypeId } = req.query
  if (!discountTypeId) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供折扣類型 id",
    })
  }
  try {
    const discountType = await getDiscountType(discountTypeId)
    if (discountType === -1) {
      return res.status(404).send({
        success: false,
        message: "折扣類型不存在",
      })
    }
    if (discountType["uid"] !== uid) {
      return res.status(403).send({
        success: false,
        message: "您無權限刪除此折扣類型",
      })
    }
    deleteDiscountType(discountTypeId)
    return res.status(200).send({
      success: true,
      message: "成功刪除折扣類型",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "刪除折扣類型失敗，請聯絡客服",
      err: error,
    })
  }
}

module.exports = {
  add,
  get,
  remove,
}
