import axios from 'axios';

 const axiosApi = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true, 
});

// api.interceptors.request.use(
//     (config) => {
//         // Example: Add auth token if available
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Optional: Add a response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Handle errors globally
//         return Promise.reject(error);
//     }
// );

export default axiosApi;