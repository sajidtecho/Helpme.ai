const app = require("../Backend/src/app")
const connectToDB = require("../Backend/src/config/database")

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