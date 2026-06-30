const express = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = new express.Router()

/**
 * @routes POST /api/auth/register
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @routes POST /api/auth/login
 */
authRouter.post("/login", authController.loginUserController)

/**
 * @routes GET /api/auth/logout
 */
authRouter.get("/logout", authController.logoutUserController)

/**
 * @routes GET /api/auth/get-me
 */
authRouter.get("/get-me", authMiddleware.authenticateToken, authController.getLoggedInUserController)

/**
 * @routes PUT /api/auth/profile
 */
authRouter.put("/profile", authMiddleware.authenticateToken, authController.updateProfileController)

// ==========================================================================
// Google OAuth Routes
// ==========================================================================
authRouter.get("/google", authController.googleLoginController)
authRouter.get("/google/callback", authController.googleCallbackController)

// ==========================================================================
// LinkedIn OAuth Routes
// ==========================================================================
authRouter.get("/linkedin", authController.linkedinLoginController)
authRouter.get("/linkedin/callback", authController.linkedinCallbackController)

module.exports = authRouter