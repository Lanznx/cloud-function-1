const { checkColumn } = require("../../helper/checkColumn.js")
const {
  addFormModel,
  updateFormModel,
  getFormModel,
  disableFormModel,
  enableFormModel,
} = require("../../model/preorder/form.model.js")

const get = async (req, res) => {
  const { uid } = req.middleware
  try {
    const form = await getFormModel(uid)
    if (form === -1) {
      return res.status(400).send({
        success: false,
        message: "預購表單為空",
      })
    }
    return res.status(200).send({
      success: true,
      message: "成功獲取預購表單",
      form: form,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "獲取預購表單失敗",
      err: error,
    })
  }
}

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
    const formInDB = await getFormModel(uid)
    if (formInDB !== -1) {
      const formId = await enableFormModel(uid)
      if (formId === -1) {
        return res.status(500).send({
          success: false,
          message: "資料庫出事了，請聯繫客服",
        })
      }
      return res.status(200).send({
        "success": true,
        "message": "預購表單已存在，啟用預購表單成功",
        "preorderFormId": formId,
      })
    }

    const formId = await addFormModel(addPreorderDTO)
    if (formId === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
      "success": true,
      "message": "建立預購表單成功",
      "preorderFormId": formId,
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
    const preorderInDB = await getFormModel(uid)
    if (preorderInDB === -2) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    } else if (preorderInDB === -1) {
      return res.status(400).send({
        success: false,
        message: "尚未建立預購表單",
      })
    }

    const formId = await updateFormModel(uid, updatePreoderDTO)
    if (formId === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
      "success": true,
      "message": "修改預購表單成功",
      "preorderFormId": formId,
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

const disable = async (req, res) => {
  const { uid } = req.middleware
  try {
    const preorderInDB = await getFormModel(uid)
    if (preorderInDB === -2) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    } else if (preorderInDB === -1) {
      return res.status(400).send({
        success: false,
        message: "尚未建立預購表單",
      })
    } else if (preorderInDB["enable"] === false) {
      return res.status(400).send({
        success: false,
        message: "預購表單已關閉",
      })
    }

    const formId = await disableFormModel(uid)
    if (formId === -1) {
      return res.status(500).send({
        success: false,
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
      "success": true,
      "message": "關閉預購表單成功",
      "preorderFormId": formId,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "關閉預購表單失敗，請聯繫客服",
      err: error,
    })
  }
}


module.exports = {
  add,
  update,
  get,
  disable,
}
