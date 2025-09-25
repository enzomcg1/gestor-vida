'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { formatGuaranies } from '@/lib/utils'

interface DashboardData {
  tasks: {
    total: number
    completed: number
    pending: number
    today: number
  }
  routines: {
    total: number
    active: number
    completedToday: number
  }
  finances: {
    totalIncome: number
    totalExpenses: number
    balance: number
    recurringIncome: number
    recurringExpenses: number
  }
  savings: {
    totalGoals: number
    activeGoals: number
    totalAmount: number
    completedGoals: number
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [tasksRes, routinesRes, transactionsRes, recurringRes, savingsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/routines'),
        fetch('/api/transactions'),
        fetch('/api/recurring-transactions'),
        fetch('/api/savings')
      ])

      if (tasksRes.ok && routinesRes.ok && transactionsRes.ok && recurringRes.ok && savingsRes.ok) {
        const [tasks, routines, transactions, recurring, savings] = await Promise.all([
          tasksRes.json(),
          routinesRes.json(),
          transactionsRes.json(),
          recurringRes.json(),
          savingsRes.json()
        ])

        // Calcular métricas de tareas
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tasksToday = tasks.filter((task: any) => {
          const taskDate = new Date(task.createdAt)
          return taskDate >= today
        })

        const tasksCompleted = tasks.filter((task: any) => task.completed)
        const tasksPending = tasks.filter((task: any) => !task.completed)

        // Calcular métricas de rutinas
        const activeRoutines = routines.filter((routine: any) => routine.isActive)
        const routinesCompletedToday = routines.filter((routine: any) => {
          const todayCompletions = routine.completions?.filter((completion: any) => {
            const completionDate = new Date(completion.completedAt)
            return completionDate >= today
          })
          return todayCompletions && todayCompletions.length > 0
        })

        // Calcular métricas financieras
        const totalIncome = transactions
          .filter((t: any) => t.type === 'INCOME')
          .reduce((sum: number, t: any) => sum + t.amount, 0)
        
        const totalExpenses = transactions
          .filter((t: any) => t.type === 'EXPENSE')
          .reduce((sum: number, t: any) => sum + t.amount, 0)

        const recurringIncome = recurring
          .filter((r: any) => r.type === 'INCOME' && r.isActive)
          .reduce((sum: number, r: any) => sum + r.amount, 0)

        const recurringExpenses = recurring
          .filter((r: any) => r.type === 'EXPENSE' && r.isActive)
          .reduce((sum: number, r: any) => sum + r.amount, 0)

        // Calcular métricas de ahorros
        const activeGoals = savings.filter((goal: any) => !goal.isCompleted)
        const completedGoals = savings.filter((goal: any) => goal.isCompleted)
        const totalSavingsAmount = savings.reduce((sum: number, goal: any) => sum + goal.currentAmount, 0)

        setData({
          tasks: {
            total: tasks.length,
            completed: tasksCompleted.length,
            pending: tasksPending.length,
            today: tasksToday.length
          },
          routines: {
            total: routines.length,
            active: activeRoutines.length,
            completedToday: routinesCompletedToday.length
          },
          finances: {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            recurringIncome,
            recurringExpenses
          },
          savings: {
            totalGoals: savings.length,
            activeGoals: activeGoals.length,
            totalAmount: totalSavingsAmount,
            completedGoals: completedGoals.length
          }
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Si no está autenticado, mostrar página de bienvenida
  if (status === 'unauthenticated') {
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
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tareas</h3>
                <p className="text-gray-600 text-sm">Organiza y gestiona tus tareas diarias con prioridades y fechas límite</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rutinas</h3>
                <p className="text-gray-600 text-sm">Establece y mantén hábitos saludables con seguimiento automático</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Finanzas</h3>
                <p className="text-gray-600 text-sm">Controla ingresos, gastos y transacciones recurrentes</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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
          </div>
        </div>
      </div>
    )
  }

  // Si está cargando la sesión
  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Dashboard para usuarios autenticados
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="mt-2 text-gray-600">Resumen de tu gestión personal</p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tareas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{data?.tasks.today || 0}</p>
              <p className="text-xs text-gray-500">{data?.tasks.completed || 0} completadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rutinas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{data?.routines.active || 0}</p>
              <p className="text-xs text-gray-500">{data?.routines.completedToday || 0} completadas hoy</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance Total</p>
              <p className={`text-2xl font-bold ${(data?.finances.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatGuaranies(data?.finances.balance || 0)}
              </p>
              <p className="text-xs text-gray-500">
                +{formatGuaranies(data?.finances.recurringIncome || 0)}/mes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🏦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ahorros Totales</p>
              <p className="text-2xl font-bold text-gray-900">{formatGuaranies(data?.savings.totalAmount || 0)}</p>
              <p className="text-xs text-gray-500">{data?.savings.activeGoals || 0} metas activas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tareas"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Nueva Tarea</p>
              <p className="text-sm text-gray-600">Agregar tarea pendiente</p>
            </div>
          </Link>

          <Link
            href="/finanzas"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">💸</span>
            <div>
              <p className="font-medium text-gray-900">Registrar Gasto</p>
              <p className="text-sm text-gray-600">Agregar transacción</p>
            </div>
          </Link>

          <Link
            href="/ahorros"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <p className="font-medium text-gray-900">Nueva Meta</p>
              <p className="text-sm text-gray-600">Crear objetivo de ahorro</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Productividad</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tareas completadas</span>
              <span className="font-semibold">{data?.tasks.completed || 0} / {data?.tasks.total || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: `${data?.tasks.total ? (data.tasks.completed / data.tasks.total) * 100 : 0}%` 
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rutinas completadas hoy</span>
              <span className="font-semibold">{data?.routines.completedToday || 0} / {data?.routines.active || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${data?.routines.active ? (data.routines.completedToday / data.routines.active) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Finanzas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingresos totales</span>
              <span className="font-semibold text-green-600">{formatGuaranies(data?.finances.totalIncome || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gastos totales</span>
              <span className="font-semibold text-red-600">{formatGuaranies(data?.finances.totalExpenses || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Balance</span>
              <span className={`font-semibold ${(data?.finances.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatGuaranies(data?.finances.balance || 0)}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recurrentes mensuales</span>
                <span className="text-sm text-gray-500">
                  +{formatGuaranies(data?.finances.recurringIncome || 0)} / -{formatGuaranies(data?.finances.recurringExpenses || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metas de ahorro */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Metas de Ahorro</h2>
        {data?.savings.totalGoals === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tienes metas de ahorro configuradas</p>
            <p className="text-sm">Crea tu primera meta para comenzar a ahorrar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data?.savings.totalGoals || 0}</div>
              <div className="text-sm text-gray-600">Total de metas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data?.savings.activeGoals || 0}</div>
              <div className="text-sm text-gray-600">Metas activas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{data?.savings.completedGoals || 0}</div>
              <div className="text-sm text-gray-600">Metas completadas</div>
            </div>
          </div>
        )}
      </div>

      {/* Actividad reciente */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Día</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">{data?.tasks.today || 0}</div>
            <div className="text-sm text-gray-600">Tareas creadas hoy</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{data?.routines.completedToday || 0}</div>
            <div className="text-sm text-gray-600">Rutinas completadas</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-600">{data?.tasks.pending || 0}</div>
            <div className="text-sm text-gray-600">Tareas pendientes</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">{data?.savings.activeGoals || 0}</div>
            <div className="text-sm text-gray-600">Metas activas</div>
          </div>
        </div>
      </div>
    </div>
  )
}