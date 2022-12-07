const checkColumn = require("../../helper/checkColumn")
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
// const tagController = require("../tag/tag.controller")

const add = async (req, res) => {
  const { uid } = req.middleware

  const { name, price, type } = req.body
  const addProductrDTO = {
    name: name,
    price: price,
    type: type,
    uid: uid,
  }
  const missedKey = checkColumn(addProductrDTO)
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  } else if (addProductrDTO["price"] <= 0) {
    return res.status(400).send({
      success: false,
      message: "price should be positive",
    })
  }

  try {
    const product = await getProductByNameModel(uid, name)
    if (product !== -1) {
      return res.status(400).send({
        success: false,
        message: "product already exist",
      })
    }

    const pid = await addProductModel(addProductrDTO)

    const typeResult = await getTypeModel(uid, type) // 這邊呼叫 type 的方式說不定有更好的寫法
    if (typeResult === -1) {
      typeController.add({
        middleware: { uid: uid },
        body: { name: type },
      }, res)
    }

    return res.status(200).send({
      success: true,
      message: "add product success",
      pid: pid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "add product failed",
    })
  }
}

const getAll = async (req, res) => {
  const { uid } = req.middleware
  try {
    const productList = await getProductListModel(uid)
    if (productList.length === 0) {
      return res.status(200).send({
        success: false,
        message: "no product found",
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
      message: "unknow error",
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
  const missedKey = checkColumn(removeProductDTO)
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  }

  try {
    const product = await getProductByPIDModel(pid)
    if (product === -1) {
      return res.status(400).send({
        success: false,
        message: "product not found",
      })
    } else if (product["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "Not Authorized to delete this product",
      })
    }

    const result = await removeProductModel(pid)
    if (result === -1) {
      return res.status(500).send({
        success: false,
        message: "Error occured when deleting product",
      })
    }
    return res.status(200).send({
      success: true,
      message: "successfully deleted",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "unknow error",
    })
  }
}

const update = async (req, res) => {
  const { uid } = req.middleware
  const { pid, name, price, type } = req.body
  const updateProductDTO = {
    pid: pid,
    name: name,
    price: price,
    type: type,
    uid: uid,
  }
  const missedKey = checkColumn(updateProductDTO)
  if (missedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${missedKey}`,
    })
  } else if (updateProductDTO["price"] <= 0) {
    return res.status(400).send({
      success: false,
      message: "price should be positive",
    })
  }

  try {
    const product = await getProductByPIDModel(pid)
    if (product === -1) {
      return res.status(400).send({
        success: false,
        message: "product not found",
      })
    } else if (product["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "Not Authorized to update this product",
      })
    }

    const result = await updateProductModel(updateProductDTO)
    if (result === -1) {
      return res.status(500).send({
        success: false,
        message: "Error occured when updating product",
      })
    }

    const typeResult = await getTypeModel(uid, type) // 這邊呼叫 type 的方式說不定有更好的寫法
    if (typeResult === -1) {
      typeController.add({
        middleware: { uid: uid },
        body: { name: type },
      }, res)
    }
    return res.status(200).send({
      success: true,
      message: "successfully updated",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "unknow error",
    })
  }
}


module.exports = { add, getAll, remove, update }
