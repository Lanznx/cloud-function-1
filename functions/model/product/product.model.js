const { db } = require("../../utils/admin")

const addProductModel = async (productDTO) => {
  try {
    const docRef = await db.collection("products").add(productDTO)
    return docRef.id
  } catch (error) {
    console.log(error)
  }
}

const isOwnByUserModel = async (pid, uid) => {
  try {
    const docRef = await db.collection("products").doc(pid).get()
    if (!docRef.exists) {
      return false
    }
    const product = docRef.data()
    if (product["uid"] !== uid) {
      return false
    }
    return true
  } catch (error) {
    console.log(error)
  }
}

const isProductExistByNameModel = async (productName) => {
  try {
    const snapShot = await db
      .collection("products")
      .where("name", "==", productName)
      .get()
    if (snapShot.empty) {
      return false
    }
    return true
  } catch (error) {
    console.log(error)
  }
}

const isProductExistByIdModel = async (pid) => {
  try {
    const docRef = await db.collection("products").doc(pid).get()
    if (!docRef.exists) {
      return false
    }
    return true
  } catch (error) {
    console.log(error)
  }
}


const getProductListModel = async (uid) => {
  try {
    const snapShot = await db
      .collection("products")
      .where("uid", "==", uid)
      .get()
    const productList = []
    snapShot.forEach((doc) => {
      const product = doc.data()
      const pid = doc.id
      productList.push({
        pid: pid,
        name: product["name"],
        type: product["type"],
        price: product["price"],
      })
    })
    return productList
  } catch (error) {
    console.log(error)
  }
}

const getProductModel = async (pid) => {
  try {
    const docRef = await db.collection("products").doc(pid).get()
    if (!docRef.exists) {
      return -1
    }
    return docRef.data()
  } catch (error) {
    console.log(error)
  }
}

const removeProductModel = async (pid) => {
  try {
    await db.collection("products").doc(pid).delete()
  } catch (error) {
    console.log(error)
    return -1
  }
}

const updateProductModel = async (productDTO) => {
  try {
    await db.collection("products").doc(productDTO["pid"]).update({
      name: productDTO["name"],
      type: productDTO["type"],
      price: productDTO["price"],
      uid: productDTO["uid"],
    })
  } catch (error) {
    console.log(error)
    return -1
  }
}


module.exports = {
  addProductModel,
  isProductExistByNameModel,
  isProductExistByIdModel,
  isOwnByUserModel,
  getProductListModel,
  getProductModel,
  removeProductModel,
  updateProductModel,
}
