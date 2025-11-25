// app/history/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChatStore } from '../../stores/chatStore'
import { chatAPI } from '../../services/api'
import { Message } from '../../schemas/messageSchema'
import { useTokenState } from '@/stores/tokenStore'
import { authAPI } from '@/services/api'
import { decodeToRefresh } from '@/services/decodeJwt'

export default function History() {
  const router = useRouter()
  const { tokenAccess, user, logout, refresh, tokenRefresh} = useTokenState()
  const { history, setHistory } = useChatStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const handleLogout = async () => {
    try {
      let res = await decodeToRefresh()
      if (!!res) {
          refresh(res)
          logout()
          await authAPI.logout(tokenRefresh as string, res as string)
        } else {
        logout()
        await authAPI.logout(tokenRefresh as string, tokenAccess as string)
      }
      router.push('/')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const loadHistory = async () => {
    if (!tokenAccess) return
    
    try {
      setIsLoading(true)
      const historyData = await chatAPI.getHistory(tokenAccess)
      setHistory(historyData)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setIsLoading(false)
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filtrar e agrupar mensagens
  const filteredHistory = history.filter(message => {
    const matchesDate = selectedDate ? formatDate(message.created_at) === selectedDate : true
    return matchesDate
  })

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

  const groupedMessages = groupMessagesByDate(filteredHistory)

  // Obter datas únicas para o filtro
  const uniqueDates = Array.from(new Set(history.map(msg => formatDate(msg.created_at)))).sort((a, b) => 
    new Date(b.split('/').reverse().join('-')).getTime() - new Date(a.split('/').reverse().join('-')).getTime()
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mesma do Chat */}
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
                onClick={() => router.push('/chat')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Chat</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
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

      {/* Área principal do Histórico */}
      <div className="flex-1 flex flex-col">
        {/* Header do Histórico */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Histórico de Conversas {user}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredHistory.length} mensagens encontradas
              </p>
            </div>
            <button
              onClick={loadHistory}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por data:
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as datas</option>
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Área do Histórico */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto py-6 px-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Carregando histórico...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Nenhuma mensagem encontrada</p>
                <p className="text-sm text-center">
                  {history.length === 0 
                    ? 'Ainda não há mensagens no histórico.' 
                    : 'Tente ajustar os filtros para ver mais resultados.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Cabeçalho da data */}
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{date}</h3>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md border">
                          {dateMessages.length} mensagens
                        </span>
                      </div>
                    </div>

                    {/* Lista de mensagens do dia */}
                    <div className="divide-y divide-gray-100">
                      {dateMessages.map((message) => (
                        <div
                          key={message.id}
                          className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                  message.is_from_user 
                                    ? 'bg-blue-500' 
                                    : 'bg-green-500'
                                }`}
                              >
                                {message.is_from_user ? 'U' : 'S'}
                              </div>
                              <div>
                                <span className={`text-sm font-medium ${
                                  message.is_from_user ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                  {message.is_from_user ? 'Usuário' : 'Sistema'}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({message.user_chat})
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                          
                          <p className="text-gray-800 text-sm leading-relaxed mb-2">
                            {message.text}
                          </p>
                          
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>ID: {message.id}</span>
                            <span>Enviado em: {formatDateTime(message.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé com estatísticas */}
        {!isLoading && filteredHistory.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Mostrando {filteredHistory.length} de {history.length} mensagens
                </span>
                <div className="flex space-x-4">
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Usuário: {filteredHistory.filter(m => m.is_from_user).length}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Sistema: {filteredHistory.filter(m => !m.is_from_user).length}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}