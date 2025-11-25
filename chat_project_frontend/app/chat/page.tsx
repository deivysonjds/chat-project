'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useChatStore } from '../../stores/chatStore'
import { chatAPI } from '../../services/api'
import { Message } from '../../schemas/messageSchema'
import { useTokenState } from '@/stores/tokenStore'
import { authAPI } from '@/services/api'
import { decodeToRefresh } from '@/services/decodeJwt'

export default function Chat() {
    const router = useRouter()
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { tokenAccess, tokenRefresh, user, logout, refresh } = useTokenState()

    const { messages, addMessage, clearMessages, isLoading, setLoading } = useChatStore()

    useEffect(() => {
        clearMessages()        
    }, [clearMessages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleLogout = async () => {
        try {
            let res = await decodeToRefresh()
            if (!!res) {
                refresh(res)
            }
            logout()
            await authAPI.logout(tokenRefresh as string, tokenAccess as string)
            router.push('/')
        } catch (error) {
            console.error('Erro no logout:', error)
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !tokenAccess) return

        const messageText = newMessage.trim()
        setNewMessage('')
        setLoading(true)

        try {
            const userMessage: Message = {
                id: `temp-${Date.now()}`,
                text: messageText,
                user_chat: 'user',
                is_from_user: true,
                created_at: new Date().toISOString(),
            }
            addMessage(userMessage)

            const response = await chatAPI.sendMessage(messageText, tokenAccess)
            addMessage(response)
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error)
            const errorMessage: Message = {
                id: Date.now().toString(),
                text: 'Erro ao enviar mensagem. Tente novamente.',
                user_chat: 'system',
                is_from_user: false,
                created_at: new Date().toISOString(),
            }
            addMessage(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Agrupar mensagens por data
    const groupMessagesByDate = (messages: Message[]) => {
        const groups: { [key: string]: Message[] } = {}

        messages.forEach(message => {
            const date = formatDate(message.created_at)
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(message)
        })

        return groups
    }

    const groupedMessages = groupMessagesByDate(messages)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header Sidebar */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">Chat App</h1>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Chat</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => router.push('/history')}
                                className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Histórico</span>
                            </button>
                        </li>
                    </ul>
                </nav>

            </div>

            {/* Área principal do Chat */}
            <div className="flex-1 flex flex-col">
                {/* Header do Chat */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">S</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{user}</h2>
                                <p className="text-sm text-gray-500">Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="max-w-4xl mx-auto py-4 px-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-lg font-medium">Nenhuma mensagem ainda</p>
                                <p className="text-sm">Comece uma conversa enviando uma mensagem!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                    <div key={date}>
                                        {/* Separador de data */}
                                        <div className="flex justify-center my-6">
                                            <div className="bg-white px-4 py-1 rounded-full border border-gray-200">
                                                <span className="text-xs font-medium text-gray-500">{date}</span>
                                            </div>
                                        </div>

                                        {/* Mensagens do dia */}
                                        <div className="space-y-3">
                                            {dateMessages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.is_from_user ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.is_from_user
                                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                                                            }`}
                                                    >
                                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                                        <p
                                                            className={`text-xs mt-1 text-right ${message.is_from_user ? 'text-blue-100' : 'text-gray-400'
                                                                }`}
                                                        >
                                                            {formatTime(message.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Loading indicator */}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input de Mensagem */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={sendMessage} className="flex space-x-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="w-full border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !newMessage.trim() || !tokenAccess}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-full transition-colors flex items-center justify-center min-w-[50px]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}