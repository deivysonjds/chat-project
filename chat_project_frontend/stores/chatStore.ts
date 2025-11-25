import { create } from 'zustand'
import { Message } from '../schemas/messageSchema'

interface ChatState {
  messages: Message[]
  history: Message[]
  isLoading: boolean
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setHistory: (messages: Message[]) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  history: [],
  isLoading: false,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setMessages: (messages) => set({ messages }),
  setHistory: (messages) => set({ history: messages }),
  clearMessages: () => set({ messages: [] }),
  setLoading: (isLoading) => set({ isLoading }),
}))