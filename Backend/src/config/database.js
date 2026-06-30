const mongoose = require("mongoose")

const globalForMongoose = globalThis

if (!globalForMongoose.__mongooseConnection) {
    globalForMongoose.__mongooseConnection = {
        conn: null,
        promise: null
    }
}

async function connectToDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined in .env file")
        }

        const cached = globalForMongoose.__mongooseConnection

        if (mongoose.connection.readyState === 1) {
            cached.conn = mongoose.connection
            return cached.conn
        }

        if (!cached.promise) {
            cached.promise = mongoose.connect(process.env.MONGO_URI)
        }

        cached.conn = await cached.promise
        console.log("Connected to database successfully")
        return cached.conn
    } catch (err) {
        console.error("Database connection error:", err.message)
        throw err
    }
}

module.exports = connectToDB
