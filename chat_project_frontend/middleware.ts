import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/chat', '/history']
const publicRoutes = ['/']

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const token = request.cookies.get('tokenRefresh')?.value
  const isAuthenticated = !!token
  console.log(token);
  
  
  // Se tentar acessar rota protegida sem autenticação
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se autenticado e tentar acessar rota pública
  if (isAuthenticated && publicRoutes.some(route => pathname === route)) {
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