import { create } from 'zustand'
import { Message } from '../schemas/messageSchema'

interface TokenState {
  tokenRefresh: string | null,
  tokenAccess: string | null,
  login: (tokenAccess: string, tokenRefresh: string) => void,
  logout: () => void,
  refresh: (token: string) => void
}

export const useChatStore = create<TokenState>((set) => ({
  tokenRefresh: null,
  tokenAccess: null,
  login: (tokenAccess: string, tokenRefresh) => set({tokenAccess: tokenAccess, tokenRefresh: tokenRefresh}),
  logout: () => set({tokenRefresh: null}),
  refresh: (tokenAccess: string) => set({tokenAccess: tokenAccess})
}))