const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const { getCorsOptions } = require("./config/environment")

const app = express()

app.use(cors(getCorsOptions()))

app.use(express.json())
app.use(cookieParser())

// Mount routes
app.use("/api/auth", authRouter)
app.use("/api/reports", interviewRouter)

module.exports = app
