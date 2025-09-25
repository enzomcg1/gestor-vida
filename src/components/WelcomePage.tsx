import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🎯 Gestor de Vida
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tu asistente personal para gestionar tareas, rutinas, finanzas y ahorros
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tareas</h3>
              <p className="text-gray-600 text-sm">Organiza y gestiona tus tareas diarias con prioridades y fechas límite</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rutinas</h3>
              <p className="text-gray-600 text-sm">Establece y mantén hábitos saludables con seguimiento automático</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Finanzas</h3>
              <p className="text-gray-600 text-sm">Controla ingresos, gastos y transacciones recurrentes</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ahorros</h3>
              <p className="text-gray-600 text-sm">Define metas de ahorro y haz seguimiento de tu progreso</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Comienza a organizar tu vida hoy!
            </h2>
            <p className="text-gray-600 mb-6">
              Únete a miles de usuarios que ya están mejorando su productividad y bienestar financiero
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Cuenta Gratis
              </Link>
              <Link
                href="/auth/signin"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>

          {/* Demo Account */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🔑 Cuenta de Demostración</h3>
            <p className="text-blue-800 mb-4">
              Prueba todas las funcionalidades con nuestra cuenta de demostración
            </p>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Email:</strong> default@gestor-vida.com<br />
                <strong>Contraseña:</strong> password123
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Productividad</h3>
              <p className="text-gray-600 text-sm">Aumenta tu eficiencia con herramientas de gestión inteligente</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis</h3>
              <p className="text-gray-600 text-sm">Visualiza tu progreso con reportes detallados y estadísticas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguridad</h3>
              <p className="text-gray-600 text-sm">Tus datos están protegidos con encriptación de nivel empresarial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
