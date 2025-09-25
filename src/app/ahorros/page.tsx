'use client'

import { useState, useEffect } from 'react'
import { formatGuaranies } from '@/lib/utils'

interface SavingsGoal {
  id: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate?: Date
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
  contributions: SavingsContribution[]
}

interface SavingsContribution {
  id: string
  savingsGoalId: string
  amount: number
  date: Date
  description?: string
}

export default function AhorrosPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showContributionForm, setShowContributionForm] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: ''
  })
  const [newContribution, setNewContribution] = useState({
    amount: '',
    description: ''
  })

  // Cargar metas de ahorro al montar el componente
  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/savings')
      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      } else {
        console.error('Error fetching savings goals')
      }
    } catch (error) {
      console.error('Error fetching savings goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.name || !newGoal.targetAmount) return

    try {
      const response = await fetch('/api/savings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGoal.name,
          description: newGoal.description || null,
          targetAmount: parseFloat(newGoal.targetAmount),
          targetDate: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
        }),
      })

      if (response.ok) {
        await fetchGoals() // Recargar las metas
        setNewGoal({ name: '', description: '', targetAmount: '', targetDate: '' })
        setShowGoalForm(false)
      } else {
        console.error('Error creating savings goal')
      }
    } catch (error) {
      console.error('Error creating savings goal:', error)
    }
  }

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal || !newContribution.amount) return

    try {
      const response = await fetch(`/api/savings/${selectedGoal}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(newContribution.amount),
          description: newContribution.description || null,
        }),
      })

      if (response.ok) {
        await fetchGoals() // Recargar las metas
        setNewContribution({ amount: '', description: '' })
        setShowContributionForm(false)
        setSelectedGoal('')
      } else {
        console.error('Error adding contribution')
      }
    } catch (error) {
      console.error('Error adding contribution:', error)
    }
  }

  const getProgressPercentage = (goal: SavingsGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const getTotalSavings = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  }

  const getGoalContributions = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId)
    return goal?.contributions || []
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando metas de ahorro...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ahorros</h1>
          <p className="mt-2 text-gray-600">Gestiona tus objetivos de ahorro</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowContributionForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Agregar Contribución
          </button>
          <button
            onClick={() => setShowGoalForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Meta
          </button>
        </div>
      </div>

      {/* Resumen de ahorros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">🏦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ahorros Totales</p>
              <p className="text-2xl font-bold text-blue-600">{formatGuaranies(getTotalSavings())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Metas Activas</p>
              <p className="text-2xl font-bold text-green-600">
                {goals.filter(g => !g.isCompleted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Metas Completadas</p>
              <p className="text-2xl font-bold text-purple-600">
                {goals.filter(g => g.isCompleted).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario para nueva meta */}
      {showGoalForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Nueva Meta de Ahorro</h2>
          <form onSubmit={handleGoalSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la meta *
              </label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Ej: Vacaciones a Europa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                rows={3}
                placeholder="Detalles sobre esta meta..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto objetivo *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha objetivo
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear Meta
              </button>
              <button
                type="button"
                onClick={() => setShowGoalForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulario para contribución */}
      {showContributionForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Agregar Contribución</h2>
          <form onSubmit={handleContributionSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta de ahorro *
              </label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              >
                <option value="">Selecciona una meta</option>
                {goals.filter(g => !g.isCompleted).map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name} ({formatGuaranies(goal.currentAmount)} / {formatGuaranies(goal.targetAmount)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                value={newContribution.amount}
                onChange={(e) => setNewContribution({ ...newContribution, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={newContribution.description}
                onChange={(e) => setNewContribution({ ...newContribution, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Ej: Pago extra del salario"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Agregar Contribución
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowContributionForm(false)
                  setSelectedGoal('')
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de metas */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <p className="text-gray-500">No tienes metas de ahorro</p>
            <p className="text-sm text-gray-400 mt-1">Crea tu primera meta para comenzar a ahorrar</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal)
            const goalContributions = getGoalContributions(goal.id)
            
            return (
              <div key={goal.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatGuaranies(goal.currentAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      de {formatGuaranies(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    {goal.targetDate && (
                      <p>Fecha objetivo: {new Date(goal.targetDate).toLocaleDateString()}</p>
                    )}
                    <p>Contribuciones: {goalContributions.length}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {goal.isCompleted ? 'Completada' : 'En progreso'}
                  </div>
                </div>

                {goalContributions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Últimas contribuciones</h4>
                    <div className="space-y-2">
                      {goalContributions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 3)
                        .map((contribution) => (
                          <div key={contribution.id} className="flex justify-between text-sm">
                            <div>
                              <span className="text-gray-900">{formatGuaranies(contribution.amount)}</span>
                              {contribution.description && (
                                <span className="text-gray-600 ml-2">- {contribution.description}</span>
                              )}
                            </div>
                            <span className="text-gray-500">
                              {new Date(contribution.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
