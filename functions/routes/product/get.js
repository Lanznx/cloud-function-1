const auth = require("../../utils/auth")
const {admin, db} = require("../../utils/admin")

const get = async (req, res) => {
    try {
        const idToken = await auth.getIdToken(req)
        const decodedClaims = await admin.auth().verifyIdToken(idToken)
        const uid = decodedClaims.uid

        const productList = await db
            .collection("products")
            .where("uid", "==", uid)
            .get()
            .docs.map((doc) => doc.data())

        return res.send({
            success: true,
            productList: productList,
        })
    } catch (error) {
        return res.send({success: false, message: "unknown error"})
    }
}

module.exports = get
