const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Defaults to 24 hours from now
        index: { expires: 0 } // TTL Index: MongoDB automatically deletes the document when the current time matches expiresAt
    }
})

const blacklistTokenModel = mongoose.model(
    "blacklistToken", blacklistTokenSchema
)

module.exports = blacklistTokenModel