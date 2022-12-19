const { checkColumn } = require("../../helper/checkColumn.js")
const { addPreorderModel } = require("../../model/preorder/preorder.model.js")

const add = async (req, res) => {
  const { uid } = req.middleware
  const { storeName, productList } = req.body
  const addPreorderDTO = {
    uid: uid,
    storeName: storeName,
    productList: productList,
  }

  const missedKey = checkColumn(addPreorderDTO, [])
  if (missedKey) {
    return res.status(400).send({
      message: `請提供 ${missedKey}`,
    })
  } else if (productList.length === 0) {
    return res.status(400).send({
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
        message: `請提供 ${missedKey}`,
      })
    }
    productDTO["price"] = parseInt(productDTO["price"])
  }


  try {
    const preorderID = await addPreorderModel(addPreorderDTO)
    if (preorderID === -1) {
      return res.status(500).send({
        message: "資料庫出事了，請聯繫客服",
      })
    }
    return res.status(200).send({
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


module.exports = {
  add,
}
