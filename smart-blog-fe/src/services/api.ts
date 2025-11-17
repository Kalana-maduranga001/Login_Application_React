import axios, { AxiosError } from 'axios';
import { refreshTokens } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',

})

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

api.interceptors.request.use((config) => {
    config.headers
    config.url

    const token = localStorage.getItem("accessToken")
    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
});

api.interceptors.response.use(
    (response) =>{
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;
        const isPublic = PUBLIC_ENDPOINTS.some((url) =>
             originalRequest?.url?.includes(url)
    )
        if(error.response?.status === 401 && !isPublic && originalRequest && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                const refreshToken = await localStorage.getItem("refreshToken")
                if(!refreshToken){
                    throw new Error("No refresh token available!")
                }

                const res = await refreshTokens(refreshToken)
                localStorage.setItem("accessToken", res.data.accessToken)

                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
                return axios(originalRequest)

            }catch(err){
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                window.location.href = "/login"
                console.error("Refresh token is invalid or expired", err);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error)
    }
)

// api.interceptors.response.use()

export default api