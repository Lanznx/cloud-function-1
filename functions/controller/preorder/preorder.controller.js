const { checkColumn } = require("../../helper/checkColumn.js")
const {
  addPreorderModel,
  updatePreorderModel,
  getPreorderModel,
} = require("../../model/preorder/preorder.model.js")

const add = async (req, res) => {
  const { uid } = req.middleware
  const addPreorderDTO = {
    enable: false,
    uid: uid,
    storeName: "我的商店",
    productList: [{
      pid: "123",
      name: "商品名稱",
      type: "商品類型",
      spec: "商品規格",
      price: 100,
    }],
  }

  try {
    const preorderInDB = await getPreorderModel(uid)
    if (preorderInDB !== -1) {
      return res.status(400).send({
        success: false,
        message: "已經有預購表單了",
      })
    }

    const preorderID = await addPreorderModel(addPreorderDTO)
    if (preorderID === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
      success: true,
      message: "建立預購表單成功",
      preorderID: preorderID,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "建立預購表單失敗，請聯繫客服",
      err: error,
    })
  }
}

const update = async (req, res) => {
  const { uid } = req.middleware
  const { storeName, productList, enable } = req.body
  const updatePreoderDTO = {
    enable: enable,
    uid: uid,
    storeName: storeName,
    productList: productList,
  }

  const missedKey = checkColumn(updatePreoderDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `請提供 ${missedKey}`,
    })
  } else if (productList.length === 0) {
    return res.status(400).send({
      success: false,
      message: "您尚未選擇任何商品",
    })
  }
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i]
    const productDTO = {
      pid: product["pid"],
      name: product["name"],
      type: product["type"],
      spec: product["spec"],
      price: product["price"],
    }
    const missedKey = checkColumn(productDTO, [])
    if (missedKey) {
      return res.status(400).send({
        success: false,
        message: `請提供 ${missedKey}`,
      })
    }
    productDTO["price"] = parseInt(productDTO["price"])
  }

  try {
    const preorderInDB = await getPreorderModel(uid)
    if (preorderInDB === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    } else if (preorderInDB === -2) {
      return res.status(200).send({
        success: true,
        message: "尚未建立預購表單",
      })
    }

    const preorderID = await updatePreorderModel(uid, updatePreoderDTO)
    if (preorderID === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
      success: true,
      message: "修改預購表單成功",
      preorderID: preorderID,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "修改預購表單失敗，請聯繫客服",
      err: error,
    })
  }
}

module.exports = {
  add,
  update,
}
