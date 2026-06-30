const app = require("../src/app")
const connectToDB = require("../src/config/database")

let connectionPromise

async function ensureDatabaseConnection() {
    if (!connectionPromise) {
        connectionPromise = connectToDB()
    }

    await connectionPromise
}

module.exports = async (req, res) => {
    await ensureDatabaseConnection()
    return app(req, res)
}