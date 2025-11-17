import api from "./api"

export const createPost = async (data: any) => {
    const res = await api.post("/posts/create", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}

export const viewAllPosts = async (page: number, limit: number) => {
    const res = await api.get(`/posts/?page=${page}&limit=${limit}`)
    return res.data
}

export const viewMyPosts = async (page: number, limit: number) => {
    const res = await api.get(`/posts/me?page=${page}&limit=${limit}`)
    return res.data
}