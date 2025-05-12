import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const publicRoutes = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/verifyemail'
    const token = request.cookies.get('token')?.value || ''

    if (publicRoutes && token) {
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    if (!publicRoutes && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    //   return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/profile/:path*', '/login/:path*', '/signup/:path*', '/verifyemail/:path*'],
}