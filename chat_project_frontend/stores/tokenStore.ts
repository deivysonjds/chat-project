import { create } from 'zustand'
import Cookies from 'js-cookie'
import { getUsernameByToken } from '@/services/decodeJwt'

interface TokenState {
	tokenRefresh: string | null,
	tokenAccess: string | null,
	user: string | null,
	login: (tokenAccess: string, tokenRefresh: string) => void,
	logout: () => void,
	refresh: (token: string) => void
}

export const cookieStorage = {
	getItem: (name: string): string | null => {
		if (typeof window === 'undefined') return null
		return Cookies.get(name) || null
	},
	setItem: (name: string, value: string): void => {
		if (typeof window === 'undefined') return
		Cookies.set(name, value, {
			expires: 7,
			secure: true,
			sameSite: 'strict',
			path: '/',
		})
	},
	removeItem: (name: string): void => {
		if (typeof window === 'undefined') return
		Cookies.remove(name, { path: '/' })
	},
}

export const useTokenState = create<TokenState>((set) => ({
	user: cookieStorage.getItem('user'),
	tokenRefresh: cookieStorage.getItem('tokenRefresh'),
	tokenAccess: cookieStorage.getItem('tokenAccess'),
	login: (tokenAccess: string, tokenRefresh) => {
		let username = getUsernameByToken(tokenRefresh)
		cookieStorage.setItem('tokenAccess', tokenAccess)
		cookieStorage.setItem('tokenRefresh', tokenRefresh)
		cookieStorage.setItem('user', username)
		set({ tokenAccess: tokenAccess, tokenRefresh: tokenRefresh, user: username})
	},
	logout: () => {
		cookieStorage.removeItem('tokenAccess')
		cookieStorage.removeItem('tokenRefresh')
		cookieStorage.removeItem('user')
		set({ tokenRefresh: null, tokenAccess: null,  user: null})
	},
	refresh: (tokenAccess: string) => {
		cookieStorage.setItem('tokenAccess', tokenAccess)
		set({ tokenAccess: tokenAccess })
	}
}))