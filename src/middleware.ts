// middleware.ts (atau src/middleware.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(request: NextRequest) {
  // Ambil token dari cookie
  const cookie = request.cookies.get('session')?.value
  
  // Rute halaman login
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  if (!cookie) {
    // Jika tidak ada sesi dan mencoba mengakses dashboard (bukan halaman login)
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Biarkan akses ke halaman login
    return NextResponse.next()
  }

  // Jika ada token, coba verifikasi
  try {
    const session = await decrypt(cookie)
    
    // Jika sesi valid dan user sedang di halaman login, lemparkan ke dashboard
    if (session && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    // Jika token kedaluwarsa atau dimanipulasi
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Lindungi semua rute KECUALI api, _next/static, _next/image, favicon.ico
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}