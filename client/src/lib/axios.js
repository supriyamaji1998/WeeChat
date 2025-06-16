import axios from 'axios';

 const axiosApi = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true, 
});

export default axiosApi;