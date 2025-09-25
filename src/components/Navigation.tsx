'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/tareas', label: 'Tareas', icon: '✅' },
  { href: '/rutinas', label: 'Rutinas', icon: '🔄' },
  { href: '/finanzas', label: 'Finanzas', icon: '💰' },
  { href: '/ahorros', label: 'Ahorros', icon: '🏦' },
  { href: '/informes', label: 'Informes', icon: '📈' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-gray-900">
              Gestor de Vida
            </div>
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </nav>
    )
  }

  if (!session) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-gray-900">
              Gestor de Vida
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Gestor de Vida</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

