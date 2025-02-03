import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "https://localhost:7127/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
