import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_MEDICAL_CHAIN_API_URL,
    timeout: 100000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default apiClient;
