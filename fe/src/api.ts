import axios from 'axios'

axios.defaults.withCredentials = true

export const authAPI = "http://localhost:5000/auth/"
export const profileAPI = "http://localhost:5000/profile/"
export const chatAPI = "http://localhost:5000/chat/"