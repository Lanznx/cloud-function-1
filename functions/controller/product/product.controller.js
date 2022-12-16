const { checkColumn } = require("../../helper/checkColumn")
const {
  addProductModel,
  getProductListModel,
  removeProductModel,
  updateProductModel,
  getProductByNameModel,
  getProductByPIDModel,
} = require("../../model/product/product.model")
const { getTypeModel } = require("../../model/type/type.model")
const typeController = require("../type/type.controller")

const add = async (req, res) => {
  const { uid } = req.middleware

  let { name, price, type, spec } = req.body
  price = parseInt(price)
  const addProductDTO = {
    name: name,
    price: price,
    type: type,
    spec: spec,
    uid: uid,
  }
  const missedKey = checkColumn(addProductDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  } else if (addProductDTO["price"] <= 0) {
    return res.status(400).send({
      success: false,
      message: "價錢應為正數",
    })
  }

  try {
    const product = await getProductByNameModel(uid, name)
    if (product !== -1) {
      return res.status(400).send({
        success: false,
        message: "產品名稱已存在",
      })
    }

    const pid = await addProductModel(addProductDTO)

    const typeResult = await getTypeModel(uid, type) // 這邊呼叫 type 的方式說不定有更好的寫法
    if (typeResult === -1) {
      typeController.add({
        middleware: { uid: uid },
        body: { name: type },
      }, null) // 沒給 res 會導致 Cannot read properties of null (reading 'status')
      // 但是我們可以忽略這個錯誤，因為我們只是想要新增 type 而已
    }

    return res.status(200).send({
      success: true,
      message: "成功新增產品",
      pid: pid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "加入產品失敗",
      err: error,
    })
  }
}

const getAll = async (req, res) => {
  const { uid } = req.middleware
  try {
    const productList = await getProductListModel(uid)
    if (productList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "產品列表為空",
        productList: [],
      })
    }

    return res.status(200).send({
      success: true,
      productList: productList,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "取得產品列表失敗，請聯絡客服",
      err: error,
    })
  }
}

const remove = async (req, res) => {
  const { uid } = req.middleware
  const { pid } = req.query
  const removeProductDTO = {
    pid: pid,
    uid: uid,
  }
  const missedKey = checkColumn(removeProductDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  }

  try {
    const product = await getProductByPIDModel(pid)
    if (product === -1) {
      return res.status(400).send({
        success: false,
        message: "找不到此產品",
      })
    } else if (product["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "無權限刪除此產品",
      })
    }

    const result = await removeProductModel(pid)
    if (result === -1) {
      return res.status(500).send({
        success: false,
        message: "刪除失敗，請聯絡客服",
      })
    }
    return res.status(200).send({
      success: true,
      message: "刪除成功",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "刪除失敗，請聯絡客服",
      err: error,
    })
  }
}

const update = async (req, res) => {
  const { uid } = req.middleware
  const { pid } = req.query
  let { name, price, type, spec } = req.body
  price = parseInt(price)
  const updateProductDTO = {
    name: name,
    price: price,
    type: type,
    spec: spec,
    pid: pid,
    uid: uid,
  }
  const missedKey = checkColumn(updateProductDTO, [])
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${missedKey}`,
    })
  } else if (updateProductDTO["price"] <= 0) {
    return res.status(400).send({
      success: false,
      message: "價錢應為正數",
    })
  }
  try {
    const product = await getProductByPIDModel(pid)
    if (product === -1) {
      return res.status(400).send({
        success: false,
        message: "找不到此產品",
      })
    } else if (product["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "無權限修改此產品",
      })
    }

    const result = await updateProductModel(updateProductDTO)
    if (result === -1) {
      return res.status(500).send({
        success: false,
        message: "修改失敗，請聯絡客服",
      })
    }

    const typeResult = await getTypeModel(uid, type) // 這邊呼叫 type 的方式說不定有更好的寫法
    if (typeResult === -1) {
      typeController.add({
        middleware: { uid: uid },
        body: { name: type },
      }, null) // 沒給 res 會導致 Cannot read properties of null (reading 'status')
      // 但是我們可以忽略這個錯誤，因為我們只是想要新增 type 而已
    }
    return res.status(200).send({
      success: true,
      message: "修改成功",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "修改失敗，請聯絡客服",
      err: error,
    })
  }
}


module.exports = { add, getAll, remove, update }
