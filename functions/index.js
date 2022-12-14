const functions = require("firebase-functions")
const express = require("express")
const app = express()

// declare body parser middleware to parse json body
const bp = require("body-parser")
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// disable cors for those domains
const cors = require("cors")({
  origin: [
    "https://ceranapos.ebg.tw",
    "https://ceranapos.web.app",
    "http://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
})
app.use(cors)

app.get("/", (req, res) => res.status(200).send("Hey there!"))
app.use("/user", require("./routes/user"))
app.use("/product", require("./routes/product"))
app.use("/material", require("./routes/material"))
app.use("/staff", require("./routes/staff"))
app.use("/type", require("./routes/type"))
app.use("/tag", require("./routes/tag"))
app.use("/stat", require("./routes/stat"))
app.use("/discount", require("./routes/discountType"))

// cloud functions
exports.api = functions
  .region("asia-east1")
  .https.onRequest(app)

exports.hello = functions
  .region("asia-east1")
  .https.onRequest((req, res) => {
    res.send("Hello from Firebase!")
  })
