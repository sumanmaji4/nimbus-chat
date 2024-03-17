import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// export default withAuth(
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const secret = process.env.NEXTAUTH_SECRET
  //managr route protection
  const isAuth = await getToken({ req, secret })
  const isLoginPage = pathname.startsWith('/login')

  const sensitiveRoutes = ['/dashboard']
  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  )

  //   console.log(isAuth, isLoginPage, pathname)

  if (isLoginPage) {
    if (isAuth) return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next()
  }

  if (!isAuth && isAccessingSensitiveRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
//   ,
//   {
//     callbacks: {
//       async authorized() {
//         return true
//       },
//     },
//   }
// )

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
}
