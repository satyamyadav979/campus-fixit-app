import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - Change this to your backend URL
// For local development:
// - iOS Simulator: http://localhost:3000
// - Android Emulator: http://10.0.2.2:3000
// - Physical Device: http://YOUR_IP_ADDRESS:3000
const API_BASE_URL = 'http://10.51.6.64:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || 'Server error occurred';
            console.error('API Error:', message);
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
            return Promise.reject(new Error('Network error. Please check your connection.'));
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject(error);
        }
    }
);

export default api;

// API endpoints
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
};

export const issueAPI = {
    createIssue: (data) => api.post('/issues', data),
    getAllIssues: (params) => api.get('/issues', { params }),
    getIssueById: (id) => api.get(`/issues/${id}`),
    updateIssue: (id, data) => api.put(`/issues/${id}`, data),
    deleteIssue: (id) => api.delete(`/issues/${id}`),
    addRemarks: (id, remarks) => api.put(`/issues/${id}/remarks`, { remarks }),
};
