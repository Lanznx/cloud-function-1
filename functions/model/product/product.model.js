const { db } = require("../../utils/admin")

const addProductModel = async (productDTO) => {
  try {
    const docRef = await db.collection("products").add(productDTO)
    return docRef.id
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
        price: product["price"],
        name: product["name"],
        type: product["type"],
        spec: product["spec"],
      })
    })
    return productList
  } catch (error) {
    console.log(error)
  }
}

const getProductByPIDModel = async (pid) => {
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

const getProductByNameModel = async (uid, productName, spec) => {
  try {
    const docRef = await db
      .collection("products")
      .where("uid", "==", uid)
      .where("name", "==", productName)
      .where("spec", "==", spec)
      .get()
    if (docRef.empty) {
      return -1
    }
    const product = []
    docRef.forEach((doc) => {
      product.push({
        pid: doc.id,
        ...doc.data(),
      })
    })
    return product[0]
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
      spec: productDTO["spec"],
    })
  } catch (error) {
    console.log(error)
    return -1
  }
}


module.exports = {
  addProductModel,
  getProductListModel,
  getProductByPIDModel,
  removeProductModel,
  updateProductModel,
  getProductByNameModel,
}
