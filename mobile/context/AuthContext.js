import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is already logged in on app start
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Verify token by fetching user profile
                const response = await authAPI.getProfile();
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auto-login failed:', error.message);
            await AsyncStorage.removeItem('userToken');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });

            const { token, user: userData } = response.data;

            // Save token to AsyncStorage
            await AsyncStorage.setItem('userToken', token);

            setUser(userData);
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await authAPI.register({ name, email, password });

            const { token, user: userData } = response.data;

            // Save token to AsyncStorage
            await AsyncStorage.setItem('userToken', token);

            setUser(userData);
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
