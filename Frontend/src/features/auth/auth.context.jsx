import { useState, useEffect } from "react";
import { AuthContext } from "./context.js";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe as apiGetMe, updateProfile as apiUpdateProfile } from "./services/auth.api.js";


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Session restoration on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const currentUser = await apiGetMe();
                if (currentUser) {
                    setUser(currentUser.user || currentUser);
                }
            } catch (error) {
                console.warn("Session restore failed, guest mode active:", error);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    async function login(email, password) {
        try {
            const response = await apiLogin(email, password);
            const currentUser = response?.data?.user || response?.data || null;
            setUser(currentUser);
            return response;
        } catch (error) {
            setUser(null);
            throw error;
        }
    }

    async function register(username, email, password, country, profession, experienceLevel, careerGoal) {
        try {
            const response = await apiRegister({ username, email, password, country, profession, experienceLevel, careerGoal });
            const currentUser = response?.data?.user || response?.data || null;
            setUser(currentUser);
            return response;
        } catch (error) {
            setUser(null);
            throw error;
        }
    }

    async function logout() {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            setUser(null);
        }
    }

    async function updateProfile(profileData) {
        try {
            const data = await apiUpdateProfile(profileData);
            const currentUser = data?.user || data || null;
            setUser(currentUser);
            return data;
        } catch (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}