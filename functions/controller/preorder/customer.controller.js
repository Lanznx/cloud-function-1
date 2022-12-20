const { checkColumn } = require("../../helper/checkColumn")
const {
  getFormModel,
} = require("../../model/preorder/form.model")
const {
  addPreorderModel,
} = require("../../model/preorder/user.model")

const get = async (req, res) => {
  const { uid } = req.params

  if (!uid) {
    return res.status(400).send({
      success: false,
      message: "請提供 uid",
    })
  }

  try {
    const form = await getFormModel(uid)
    if (form === -1 || form["enable"] === false) {
      return res.status(200).send({
        success: true,
        message: "找不到表單",
        form: null,
      })
    }
    if (form === -2) {
      return res.status(500).send({
        success: false,
        message: "獲取表單失敗",
        form: null,
      })
    }
    return res.status(200).send({
      "success": true,
      "message": "成功獲取表單",
      "preorder-form": form,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "獲取表單失敗",
      err: error,
    })
  }
}

const add = async (req, res) => {
  const { uid } = req.params
  const { contact, productList, pickUpTime, note } = req.body

  const addPreorderDTO = {
    uid: uid,
    note: note,
    contact: contact,
    productList: productList,
    pickUpTime: pickUpTime,
    createTime: new Date().getTime(),
    isPicked: false,
  }

  const missedKey = checkColumn(addPreorderDTO, ["note"])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `請提供 ${missedKey}`,
    })
  }
  addPreorderDTO["pickUpTime"] = parseInt(addPreorderDTO["pickUpTime"])

  for (let i = 0; i < addPreorderDTO["productList"].length; i++) {
    const product = addPreorderDTO["productList"][i]

    const productDTO = {
      pid: product["pid"],
      name: product["name"],
      type: product["type"],
      spec: product["spec"],
      price: product["price"],
      amount: product["amount"],
    }

    const missedKey = checkColumn(productDTO, [])
    if (missedKey) {
      return res.status(400).send({
        success: false,
        message: `請提供 ${missedKey}`,
      })
    }
    product["amount"] = parseInt(product["amount"])
    product["price"] = parseInt(product["price"])

    if (product["amount"] <= 0 || product["price"] <= 0) {
      return res.status(400).send({
        success: false,
        message: "數量與價錢必須大於 0",
      })
    }
  }

  try {
    const form = await getFormModel(uid)
    if (form === -1 || form["enable"] === false) {
      return res.status(200).send({
        success: true,
        message: "表單已關閉或不存在",
      })
    }

    const preorder = await addPreorderModel(addPreorderDTO)
    if (preorder === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
      "success": true,
      "message": "建立預購成功",
      "preorderId": preorder,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "建立預購失敗",
      err: error,
    })
  }
}


module.exports = {
  get,
  add,
}
