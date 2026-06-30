import axios from "axios";
import { API_BASE_URL } from "../../../config/api.js";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

/**
 * Registers a new user.
 * @param {Object} registrationData
 */
export async function register({ username, email, password, country, profession, experienceLevel, careerGoal }) {
    try {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password,
            country,
            profession,
            experienceLevel,
            careerGoal
        });
        return response;
    } catch (error) {
        console.error("error during register", error);
        throw error;
    }
}

/**
 * Logins an existing user.
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
    try {
        const response = await api.post('/api/auth/login', {
            email,
            password
        });
        return response;
    } catch (error) {
        console.error("error during login", error);
        throw error;
    }
}

/**
 * Logouts the current user.
 */
export async function logout() {
    try {
        const response = await api.get('/api/auth/logout');
        return response;
    } catch (error) {
        console.error("error during logout", error);
        throw error;
    }
}

/**
 * Gets the current active user session profile details.
 */
export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (error) {
        console.error("error getting current user", error);
        throw error;
    }
}

/**
 * Updates the profile of the current active session.
 * @param {Object} profileData
 */
export async function updateProfile(profileData) {
    try {
        const response = await api.put('/api/auth/profile', profileData);
        return response.data;
    } catch (error) {
        console.error("error during profile update", error);
        throw error;
    }
}
