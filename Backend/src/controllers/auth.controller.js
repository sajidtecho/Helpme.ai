const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const blacklistTokenModel = require("../models/blacklist.modal")
const { getCookieOptions, getPrimaryFrontendUrl } = require("../config/environment")

/**
 * @name registerUserController
 * @description Register a new user, expects username,email,password from request body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password, country, profession, experienceLevel, careerGoal } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide all the required fields"
        })
    }

    const isUserExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserExist) {
        return res.status(400).json({
            message: "User already exist with this username or email"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await userModel.create({
        username,
        email,
        password: hash,
        country: country || "",
        profession: profession || "",
        experienceLevel: experienceLevel || "",
        careerGoal: careerGoal || ""
    })

    const token = jwt.sign(
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1D" }
    )

    res.cookie("token", token, getCookieOptions())

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            country: newUser.country,
            profession: newUser.profession,
            experienceLevel: newUser.experienceLevel,
            careerGoal: newUser.careerGoal
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user, expects email,password from request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body
    
    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide both email and password"
        })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    // Await bcrypt.compare as it is asynchronous
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    // Use user._id and user.username
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1D" }
    )

    res.cookie("token", token, getCookieOptions())
    res.status(200).json({
        message: "user loggedIn Successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            country: user.country,
            profession: user.profession,
            experienceLevel: user.experienceLevel,
            careerGoal: user.careerGoal,
            avatar: user.avatar,
            authProvider: user.authProvider
        }
    })
}

/**
 * @name logoutUserController
 * @description Logout user by blacklisting the current token
 * @access Private
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token
    if (token) {
        await blacklistTokenModel.create({ token })
    }
    res.clearCookie("token", getCookieOptions())

    res.status(200).json({
        message: "user log out Successfully"
    })
}

/**
 * @name getLoggedInUserController
 * @description Get currently logged in user profile
 * @access Private
 */
async function getLoggedInUserController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            user
        })
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

// ==========================================================================
// Google OAuth Simulation Controllers
// ==========================================================================

async function googleLoginController(req, res) {
    // In production: Redirect to Google authorization consent screen URL.
    // In development: Mock redirect directly to callback route with demo credentials.
    const mockId = "google_user_" + Math.floor(Math.random() * 1000000);
    const callbackUrl = `/api/auth/google/callback?id=${mockId}&name=Google+User&email=google.user@gmail.com&avatar=https://api.dicebear.com/7.x/initials/svg?seed=Google%20User`;
    
    console.log("🔗 Simulating Google Redirect to:", callbackUrl);
    res.redirect(callbackUrl);
}

async function googleCallbackController(req, res) {
    const { id, name, email, avatar } = req.query;
    const frontendUrl = getPrimaryFrontendUrl()

    if (!id || !email) {
        return res.redirect(`${frontendUrl}/?error=OAuth+failed`);
    }

    try {
        // Look up by googleId or email
        let user = await userModel.findOne({
            $or: [{ googleId: id }, { email }]
        });

        if (user) {
            // Update existing user details if they didn't have googleId linked
            if (!user.googleId) {
                user.googleId = id;
                user.authProvider = "google";
            }
            if (avatar && !user.avatar) {
                user.avatar = avatar;
            }
            await user.save();
        } else {
            // Create a new user profile
            user = await userModel.create({
                username: name || email.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
                email,
                googleId: id,
                avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
                authProvider: "google"
            });
        }

        // Generate session JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1D" }
        );

        // Inject session cookie and redirect to dashboard
        res.cookie("token", token, getCookieOptions());
        res.redirect(`${frontendUrl}/dashboard`);
    } catch (error) {
        console.error("❌ Google callback error:", error);
        res.redirect(`${frontendUrl}/?error=database_error`);
    }
}

// ==========================================================================
// LinkedIn OAuth Simulation Controllers
// ==========================================================================

async function linkedinLoginController(req, res) {
    // In production: Redirect to LinkedIn authorization consent screen URL.
    // In development: Mock redirect directly to callback route with demo credentials.
    const mockId = "linkedin_user_" + Math.floor(Math.random() * 1000000);
    const callbackUrl = `/api/auth/linkedin/callback?id=${mockId}&name=LinkedIn+User&email=linkedin.user@gmail.com&avatar=https://api.dicebear.com/7.x/initials/svg?seed=LinkedIn%20User`;
    
    console.log("🔗 Simulating LinkedIn Redirect to:", callbackUrl);
    res.redirect(callbackUrl);
}

async function linkedinCallbackController(req, res) {
    const { id, name, email, avatar } = req.query;
    const frontendUrl = getPrimaryFrontendUrl()

    if (!id || !email) {
        return res.redirect(`${frontendUrl}/?error=OAuth+failed`);
    }

    try {
        // Look up by linkedinId or email
        let user = await userModel.findOne({
            $or: [{ linkedinId: id }, { email }]
        });

        if (user) {
            // Update existing user details if they didn't have linkedinId linked
            if (!user.linkedinId) {
                user.linkedinId = id;
                user.authProvider = "linkedin";
            }
            if (avatar && !user.avatar) {
                user.avatar = avatar;
            }
            await user.save();
        } else {
            // Create a new user profile
            user = await userModel.create({
                username: name || email.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
                email,
                linkedinId: id,
                avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
                authProvider: "linkedin"
            });
        }

        // Generate session JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1D" }
        );

        // Inject session cookie and redirect to dashboard
        res.cookie("token", token, getCookieOptions());
        res.redirect(`${frontendUrl}/dashboard`);
    } catch (error) {
        console.error("❌ LinkedIn callback error:", error);
        res.redirect(`${frontendUrl}/?error=database_error`);
    }
}

/**
 * @name updateProfileController
 * @description Updates details of the logged in user profile
 * @access Private
 */
async function updateProfileController(req, res) {
    const { username, country, profession, experienceLevel, careerGoal, avatar } = req.body;
    try {
        const userId = req.user.id;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username && username !== user.username) {
            const existingUser = await userModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username is already taken" });
            }
            user.username = username;
        }

        if (country !== undefined) user.country = country;
        if (profession !== undefined) user.profession = profession;
        if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
        if (careerGoal !== undefined) user.careerGoal = careerGoal;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                country: user.country,
                profession: user.profession,
                experienceLevel: user.experienceLevel,
                careerGoal: user.careerGoal,
                avatar: user.avatar,
                authProvider: user.authProvider
            }
        });
    } catch (err) {
        console.error("❌ Error updating profile:", err);
        res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getLoggedInUserController,
    googleLoginController,
    googleCallbackController,
    linkedinLoginController,
    linkedinCallbackController,
    updateProfileController
}