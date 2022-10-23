const { admin } = require("../utils/admin")

const auth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization || ""
        const components = authorizationHeader.split(" ")
        if (components.length != 2) {
            return res.send({ success: false, message: "Invalid Token format" })
        }
        const token = components[1]
        const decodedClaims = await admin.auth().verifyIdToken(token)
        req.middleware = {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
        }
        return next()
    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "Invalid Token" })
    }
}

module.exports = { auth }
