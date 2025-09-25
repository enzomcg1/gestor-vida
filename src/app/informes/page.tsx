'use client'

import { useState, useEffect } from 'react'
import { formatGuaranies } from '@/lib/utils'

interface ReportData {
  tasks: {
    total: number
    completed: number
    pending: number
    completedThisPeriod: number
  }
  routines: {
    total: number
    active: number
    completedThisPeriod: number
    consistency: number
  }
  finances: {
    totalIncome: number
    totalExpenses: number
    balance: number
    expensesByCategory: Array<{
      category: string
      amount: number
      percentage: number
      color: string
    }>
    monthlyTrend: Array<{
      month: string
      income: number
      expenses: number
    }>
  }
  savings: {
    totalGoals: number
    activeGoals: number
    completedGoals: number
    totalAmount: number
    progress: number
  }
}

export default function InformesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const [tasksRes, routinesRes, transactionsRes, recurringRes, savingsRes, categoriesRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/routines'),
        fetch('/api/transactions'),
        fetch('/api/recurring-transactions'),
        fetch('/api/savings'),
        fetch('/api/categories')
      ])

      if (tasksRes.ok && routinesRes.ok && transactionsRes.ok && recurringRes.ok && savingsRes.ok && categoriesRes.ok) {
        const [tasks, routines, transactions, , savings, categories] = await Promise.all([
          tasksRes.json(),
          routinesRes.json(),
          transactionsRes.json(),
          recurringRes.json(),
          savingsRes.json(),
          categoriesRes.json()
        ])

        // Calcular fechas según el período seleccionado
        const now = new Date()
        let startDate: Date

        switch (selectedPeriod) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
          default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }

        // Filtrar datos por período
        const tasksThisPeriod = tasks.filter((task: any) => {
          const taskDate = new Date(task.createdAt)
          return taskDate >= startDate
        })

        const tasksCompletedThisPeriod = tasksThisPeriod.filter((task: any) => task.completed)

        const routinesCompletedThisPeriod = routines.filter((routine: any) => {
          const completions = routine.completions?.filter((completion: any) => {
            const completionDate = new Date(completion.completedAt)
            return completionDate >= startDate
          })
          return completions && completions.length > 0
        })

        const transactionsThisPeriod = transactions.filter((transaction: any) => {
          const transactionDate = new Date(transaction.date)
          return transactionDate >= startDate
        })

        // Calcular métricas financieras
        const totalIncome = transactionsThisPeriod
          .filter((t: any) => t.type === 'INCOME')
          .reduce((sum: number, t: any) => sum + t.amount, 0)

        const totalExpenses = transactionsThisPeriod
          .filter((t: any) => t.type === 'EXPENSE')
          .reduce((sum: number, t: any) => sum + t.amount, 0)

        // Análisis de gastos por categoría
        const expensesByCategory = categories
          .filter((cat: any) => cat.type === 'EXPENSE')
          .map((category: any) => {
            const categoryExpenses = transactionsThisPeriod
              .filter((t: any) => t.categoryId === category.id && t.type === 'EXPENSE')
              .reduce((sum: number, t: any) => sum + t.amount, 0)
            
            return {
              category: category.name,
              amount: categoryExpenses,
              percentage: totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0,
              color: category.color || '#6B7280'
            }
          })
          .filter((cat: any) => cat.amount > 0)
          .sort((a: any, b: any) => b.amount - a.amount)

        // Calcular métricas de ahorros
        const activeGoals = savings.filter((goal: any) => !goal.isCompleted)
        const completedGoals = savings.filter((goal: any) => goal.isCompleted)
        const totalSavingsAmount = savings.reduce((sum: number, goal: any) => sum + goal.currentAmount, 0)
        const totalTargetAmount = savings.reduce((sum: number, goal: any) => sum + goal.targetAmount, 0)
        const progress = totalTargetAmount > 0 ? (totalSavingsAmount / totalTargetAmount) * 100 : 0

        // Calcular consistencia de rutinas
        const activeRoutines = routines.filter((routine: any) => routine.isActive)
        const consistency = activeRoutines.length > 0 
          ? (routinesCompletedThisPeriod.length / activeRoutines.length) * 100 
          : 0

        setData({
          tasks: {
            total: tasks.length,
            completed: tasks.filter((t: any) => t.completed).length,
            pending: tasks.filter((t: any) => !t.completed).length,
            completedThisPeriod: tasksCompletedThisPeriod.length
          },
          routines: {
            total: routines.length,
            active: activeRoutines.length,
            completedThisPeriod: routinesCompletedThisPeriod.length,
            consistency
          },
          finances: {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            expensesByCategory,
            monthlyTrend: [] // TODO: Implementar tendencias mensuales
          },
          savings: {
            totalGoals: savings.length,
            activeGoals: activeGoals.length,
            completedGoals: completedGoals.length,
            totalAmount: totalSavingsAmount,
            progress
          }
        })
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'Esta semana'
      case 'month': return 'Este mes'
      case 'year': return 'Este año'
      default: return period
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando informes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Informes</h1>
          <p className="mt-2 text-gray-600">Análisis y reportes de tu actividad</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen de actividad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
              <p className="text-2xl font-bold text-blue-600">{data?.tasks.completedThisPeriod || 0}</p>
              <p className="text-xs text-gray-500">{data?.tasks.completed || 0} total</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rutinas Completadas</p>
              <p className="text-2xl font-bold text-green-600">{data?.routines.completedThisPeriod || 0}</p>
              <p className="text-xs text-gray-500">{data?.routines?.consistency?.toFixed(1) || 0}% consistencia</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-600">{formatGuaranies(data?.finances.totalExpenses || 0)}</p>
              <p className="text-xs text-gray-500">Balance: {formatGuaranies(data?.finances.balance || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🏦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ahorros Acumulados</p>
              <p className="text-2xl font-bold text-green-600">{formatGuaranies(data?.savings.totalAmount || 0)}</p>
              <p className="text-xs text-gray-500">{data?.savings?.progress?.toFixed(1) || 0}% progreso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de productividad */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Productividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{data?.tasks.completed || 0}</div>
            <div className="text-sm text-gray-600">Tareas Completadas</div>
            <div className="text-xs text-gray-500">{data?.tasks.total || 0} total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data?.routines.completedThisPeriod || 0}</div>
            <div className="text-sm text-gray-600">Rutinas Completadas</div>
            <div className="text-xs text-gray-500">{data?.routines.active || 0} activas</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{data?.routines?.consistency?.toFixed(1) || 0}%</div>
            <div className="text-sm text-gray-600">Consistencia</div>
            <div className="text-xs text-gray-500">Rutinas completadas</div>
          </div>
        </div>
      </div>

      {/* Análisis de gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h2>
          {(data?.finances?.expensesByCategory?.length || 0) === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay datos de gastos</p>
              <p className="text-sm">Agrega transacciones para ver el análisis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.finances?.expensesByCategory?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatGuaranies(category.amount)}</div>
                    <div className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Ahorro</h2>
          {(data?.savings?.totalGoals || 0) === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay datos de ahorro</p>
              <p className="text-sm">Crea metas de ahorro para ver las tendencias</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progreso total</span>
                <span className="text-sm font-semibold text-gray-900">{data?.savings?.progress?.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${data?.savings?.progress || 0}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{data?.savings?.activeGoals}</div>
                  <div className="text-xs text-gray-600">Metas Activas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{data?.savings?.completedGoals}</div>
                  <div className="text-xs text-gray-600">Metas Completadas</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen de hábitos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Hábitos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-medium text-gray-900">Consistencia</h3>
            <p className="text-sm text-gray-600 mt-1">{data?.routines?.consistency?.toFixed(1) || 0}%</p>
            <p className="text-xs text-gray-500">Rutinas completadas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-medium text-gray-900">Eficiencia</h3>
            <p className="text-sm text-gray-600 mt-1">
              {data?.tasks?.total ? ((data?.tasks?.completed || 0) / (data?.tasks?.total || 1) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-500">Tareas completadas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-medium text-gray-900">Progreso</h3>
            <p className="text-sm text-gray-600 mt-1">{data?.savings?.progress?.toFixed(1) || 0}%</p>
            <p className="text-xs text-gray-500">Metas de ahorro alcanzadas</p>
          </div>
        </div>
      </div>

      {/* Recomendaciones dinámicas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones Personalizadas</h2>
        <div className="space-y-4">
          {(data?.tasks?.pending || 0) > 5 && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="text-yellow-500 text-xl">⚠️</div>
              <div>
                <h3 className="font-medium text-yellow-900">Tienes muchas tareas pendientes</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Tienes {data?.tasks?.pending || 0} tareas pendientes. Considera priorizar las más importantes.
                </p>
              </div>
            </div>
          )}

          {(data?.routines?.consistency || 0) < 50 && (data?.routines?.active || 0) > 0 && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <div className="text-red-500 text-xl">📉</div>
              <div>
                <h3 className="font-medium text-red-900">Baja consistencia en rutinas</h3>
                <p className="text-sm text-red-700 mt-1">
                  Tu consistencia es del {data?.routines?.consistency?.toFixed(1) || 0}%. Intenta completar al menos una rutina diaria.
                </p>
              </div>
            </div>
          )}

          {(data?.finances?.balance || 0) < 0 && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <div className="text-red-500 text-xl">💸</div>
              <div>
                <h3 className="font-medium text-red-900">Balance negativo</h3>
                <p className="text-sm text-red-700 mt-1">
                  Tu balance es negativo ({formatGuaranies(data?.finances?.balance || 0)}). Revisa tus gastos y considera reducir algunos.
                </p>
              </div>
            </div>
          )}

          {(data?.savings?.progress || 0) > 0 && (data?.savings?.progress || 0) < 25 && (
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-500 text-xl">🏦</div>
              <div>
                <h3 className="font-medium text-blue-900">Progreso lento en ahorros</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Has ahorrado {data?.savings?.progress?.toFixed(1) || 0}% de tus metas. Considera aumentar tus contribuciones.
                </p>
              </div>
            </div>
          )}

          {(data?.tasks?.completed || 0) > 0 && (data?.routines?.consistency || 0) > 70 && (data?.finances?.balance || 0) >= 0 && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="text-green-500 text-xl">🎉</div>
              <div>
                <h3 className="font-medium text-green-900">¡Excelente progreso!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Mantienes buena consistencia en rutinas, completas tareas y tienes balance positivo. ¡Sigue así!
                </p>
              </div>
            </div>
          )}

          {(data?.tasks?.total || 0) === 0 && (data?.routines?.total || 0) === 0 && (data?.finances?.totalExpenses || 0) === 0 && (
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-500 text-xl">🚀</div>
              <div>
                <h3 className="font-medium text-blue-900">¡Comienza tu viaje!</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Agrega tus primeras tareas, rutinas y transacciones para comenzar a ver tu progreso.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

