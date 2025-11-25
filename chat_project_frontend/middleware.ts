// app/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/chat', '/history']
const publicRoutes = ['/']

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const token = request.cookies.get('refreshToken')?.value
  const isAuthenticated = !!token

  console.log('Proxy - Path:', pathname, 'Authenticated:', isAuthenticated) // Debug

  // Se tentar acessar rota protegida sem autenticação
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    console.log('Redirecting to login from protected route')
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se autenticado e tentar acessar rota pública
  if (isAuthenticated && publicRoutes.some(route => pathname === route)) {
    console.log('Redirecting to chat from public route')
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/chat',
    '/history',
    '/'
  ]
}