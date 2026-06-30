const DEFAULT_LOCAL_FRONTEND_URL = "http://localhost:5173"

function normalizeOrigin(value) {
    return value ? value.trim().replace(/\/$/, "") : ""
}

function getFrontendOrigins() {
    const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || DEFAULT_LOCAL_FRONTEND_URL

    return rawOrigins
        .split(",")
        .map(normalizeOrigin)
        .filter(Boolean)
}

function getPrimaryFrontendUrl() {
    return getFrontendOrigins()[0] || DEFAULT_LOCAL_FRONTEND_URL
}

function isProduction() {
    return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL)
}

function getCorsOptions() {
    const allowedOrigins = getFrontendOrigins()

    if (!allowedOrigins.length) {
        return {
            origin: true,
            credentials: true
        }
    }

    return {
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
                return callback(null, true)
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`))
        },
        credentials: true
    }
}

function getCookieOptions() {
    const hasExplicitFrontendOrigin = getFrontendOrigins().length > 0

    return {
        httpOnly: true,
        secure: isProduction(),
        sameSite: hasExplicitFrontendOrigin ? "none" : "lax",
        path: "/"
    }
}

module.exports = {
    getCorsOptions,
    getCookieOptions,
    getFrontendOrigins,
    getPrimaryFrontendUrl,
    isProduction
}