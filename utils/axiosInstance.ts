// File: ets-frontend/utils/axiosInstance.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a custom Axios instance for API requests
const axiosInstance = axios.create({
    // Base URL for all API calls (from your environment variables)
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000, // Request timeout
    headers: {
        'Content-Type': 'application/json', // Default content type
    },
});

// Request interceptor to add the JWT token to outgoing requests
axiosInstance.interceptors.request.use(
    async (config) => {
        // Retrieve the JWT token from AsyncStorage
        const token = await AsyncStorage.getItem('jwtToken');
        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;