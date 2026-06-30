require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const generateInterviewReport = require("./src/services/ai.service")

// Connect to Database
connectToDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})