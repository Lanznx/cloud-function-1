const auth = require("../../middleware/auth")
const { admin, db } = require("../../utils/admin")

const add = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid

        const { name, price, amount, materialList } = req.body
        const newProduct = {
            uid: uid,
            name: name,
            price: price,
            amount: amount,
            materialList: materialList,
        }
        await db.collection("products").add(newProduct)
        return res.send({ success: true })
    } catch (error) {
        return res.send({ success: false, message: "unknown error" })
    }
}

module.exports = add
