const auth = require("../../utils/auth")
const {admin, db} = require("../../utils/admin")

const update = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid

        const {productId, name, price, amount, materialList} =
            req.body
        const product = await db.collection("products").doc(productId).get()
        if (product.data().uid !== uid) {
            return res.send({
                success: false,
                message: "You are not authorized to update this product",
            })
        }

        const newProduct = {
            uid: uid,
            name: name,
            price: price,
            amount: amount,
            materialList: materialList,
        }
        await db.collection("products").doc(productId).update(newProduct)
        return res.send({success: true})
    } catch (error) {
        return res.send({success: false, message: "unknown error"})
    }
}

module.exports = update
