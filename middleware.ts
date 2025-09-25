import { auth } from "@/lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/tareas',
    '/rutinas', 
    '/finanzas',
    '/ahorros',
    '/informes'
  ]

  // Rutas de autenticación (no deben ser accesibles si ya está logueado)
  const authRoutes = ['/auth/signin', '/auth/signup']

  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )

  // Si es una ruta protegida y no está logueado, redirigir a login
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/auth/signin', nextUrl))
  }

  // Si es una ruta de auth y ya está logueado, redirigir al dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL('/', nextUrl))
  }

  // Permitir acceso a la página principal solo si está logueado
  if (nextUrl.pathname === '/' && !isLoggedIn) {
    return Response.redirect(new URL('/auth/signin', nextUrl))
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
