const auth = require("../../middleware/auth")
const { admin, db } = require("../../utils/admin")

const _delete = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid

        const { productId } = req.body
        const product = await db.collection("products").doc(productId).get()
        if (product.data().uid !== uid) {
            return res.send({
                success: false,
                message: "You are not authorized to delete this product",
            })
        }
        await db.collection("products").doc(productId).delete()
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}

module.exports = _delete
