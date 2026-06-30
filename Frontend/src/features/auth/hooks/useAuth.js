import { useContext } from "react";
import { AuthContext } from "../context.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {
        user,
        loading,
        setLoading,
        login,
        register,
        logout,
        updateProfile
    } = context;

    /**
     * Authenticate login credentials.
     */
    const handlelogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await login(email, password);
            return response;
        } catch (error) {
            console.error("error during login transaction:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register profile credentials.
     */
    const handleRegister = async ({ username, email, password, country, profession, experienceLevel, careerGoal }) => {
        setLoading(true);
        try {
            const response = await register(username, email, password, country, profession, experienceLevel, careerGoal);
            return response;
        } catch (error) {
            console.error("error during register transaction:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Terminate active user session.
     */
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update profile details.
     */
    const handleUpdateProfile = async (profileData) => {
        setLoading(true);
        try {
            const response = await updateProfile(profileData);
            return response;
        } catch (error) {
            console.error("error during profile update transaction:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        logout,
        updateProfile,
        handlelogin,
        handleRegister,
        handleLogout,
        handleUpdateProfile
    };
};
