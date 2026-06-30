const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: false, // Optional for Google / LinkedIn OAuth users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null/undefined values without duplicate key errors
    },
    linkedinId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    authProvider: {
        type: String,
        enum: ["local", "google", "linkedin"],
        default: "local",
    },
    country: {
        type: String,
        default: "",
    },
    profession: {
        type: String,
        default: "",
    },
    experienceLevel: {
        type: String,
        default: "",
    },
    careerGoal: {
        type: String,
        default: "",
    }
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
