const jwt = require("jsonwebtoken")
const blacklistTokenModel = require("../models/blacklist.modal")

async function authenticateToken(req, res, next) {
    // Allow token from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: token is invalide"
        })
    }

    const isTokenBlacklisted = await blacklistTokenModel.findOne({ token })
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized: Token is blacklisted"
        })
    }

    try {
        const isBlacklisted = await blacklistTokenModel.exists({ token })
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized: Token is blacklisted"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({
            message: "Forbidden: Invalid token"
        })
    }
}

module.exports = { authenticateToken }