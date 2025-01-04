import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; 

export const AuthService = {
    async login(email: string, password: string) {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; 
    },

    async updatePassword(userId: string, oldPassword: string, newPassword: string) {
        const response = await axios.patch(`${API_URL}/update-password`, { oldPassword, newPassword }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, 
            },
        });
        return response.data; 
    },
};