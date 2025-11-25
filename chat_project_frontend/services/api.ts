import axios from 'axios'
import { Message } from '../schemas/messageSchema'
import { Tokens } from '@/schemas/authSchema'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const authAPI = {
  login: async (username: string, password: string): Promise<Tokens> => {
    const response = await api.post('/api/token', { username, password })
        .then((res)=>{
            return res.data
        }).catch((res)=>{
            throw new Error(`Erro: ${res}`)
        })
        
    return response
  },
  refresh: async(refresh: string) => {
    const response = await api.post('/api/token/refresh', {refresh:refresh})
        .then((res)=>{
            return res.data
        }).catch((res)=>{
            throw new Error(`Erro: ${res}`)
        })
    return response
  },
  logout: async(refresh: string, acess: string) => {
    const response = await api.post('/api/token/logout', {refresh:refresh}, {headers: {Authorization: `Bearer ${acess}`}})
        .then((res)=>{
            return res.data
        }).catch((res)=>{
            throw new Error(`Erro: ${res}`)
        })
    return response
  }
}

export const chatAPI = {
  sendMessage: async (text: string, accessToken: string): Promise<Message> => {
    const response = await api.post('/api/messages', { text: text }, {headers: {Authorization: `Bearer ${accessToken}`}})
    return response.data
  },
  
  getHistory: async (accessToken: string): Promise<Message[]> => {
    const response = await api.get('/api/messages', {headers: {Authorization: `Bearer ${accessToken}`}})
    return response.data
  },
}

export default api