'use client'

import { useState, useEffect } from 'react'

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY'

interface Routine {
  id: string
  name: string
  description?: string
  frequency: Frequency
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  completions: RoutineCompletion[]
}

interface RoutineCompletion {
  id: string
  routineId: string
  completedAt: Date
  notes?: string
}

export default function RutinasPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    frequency: 'DAILY' as Frequency
  })

  // Cargar rutinas al montar el componente
  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/routines')
      if (response.ok) {
        const data = await response.json()
        setRoutines(data)
      } else {
        console.error('Error fetching routines')
      }
    } catch (error) {
      console.error('Error fetching routines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoutine.name.trim()) return

    try {
      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoutine.name,
          description: newRoutine.description || null,
          frequency: newRoutine.frequency,
          isActive: true,
        }),
      })

      if (response.ok) {
        await fetchRoutines() // Recargar las rutinas
        setNewRoutine({ name: '', description: '', frequency: 'DAILY' })
        setShowForm(false)
      } else {
        console.error('Error creating routine')
      }
    } catch (error) {
      console.error('Error creating routine:', error)
    }
  }

  const toggleRoutine = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentActive,
        }),
      })

      if (response.ok) {
        await fetchRoutines() // Recargar las rutinas
      } else {
        console.error('Error updating routine')
      }
    } catch (error) {
      console.error('Error updating routine:', error)
    }
  }

  const completeRoutine = async (routineId: string) => {
    try {
      const response = await fetch(`/api/routines/${routineId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        await fetchRoutines() // Recargar las rutinas
      } else {
        console.error('Error completing routine')
      }
    } catch (error) {
      console.error('Error completing routine:', error)
    }
  }

  const deleteRoutine = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta rutina?')) return

    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRoutines() // Recargar las rutinas
      } else {
        console.error('Error deleting routine')
      }
    } catch (error) {
      console.error('Error deleting routine:', error)
    }
  }

  const getRoutineCompletions = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId)
    return routine?.completions || []
  }

  const getTodayCompletions = (routineId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const routine = routines.find(r => r.id === routineId)
    return routine?.completions?.filter(c => 
      new Date(c.completedAt) >= today
    ) || []
  }

  const getFrequencyLabel = (frequency: Frequency) => {
    switch (frequency) {
      case 'DAILY': return 'Diaria'
      case 'WEEKLY': return 'Semanal'
      case 'MONTHLY': return 'Mensual'
      default: return frequency
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando rutinas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rutinas</h1>
          <p className="mt-2 text-gray-600">Gestiona tus hábitos diarios</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Rutina
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Nueva Rutina</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Ej: Ejercicio matutino"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={newRoutine.description}
                onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                rows={3}
                placeholder="Detalles sobre esta rutina..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia
              </label>
              <select
                value={newRoutine.frequency}
                onChange={(e) => setNewRoutine({ ...newRoutine, frequency: e.target.value as Frequency })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="DAILY">Diaria</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear Rutina
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {routines.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <p className="text-gray-500">No tienes rutinas configuradas</p>
            <p className="text-sm text-gray-400 mt-1">Crea tu primera rutina para comenzar</p>
          </div>
        ) : (
          routines.map((routine) => {
            const routineCompletions = getRoutineCompletions(routine.id)
            const todayCompletions = getTodayCompletions(routine.id)
            const isCompletedToday = todayCompletions.length > 0

            return (
              <div
                key={routine.id}
                className={`bg-white p-6 rounded-lg shadow-sm border ${
                  !routine.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${!routine.isActive ? 'text-gray-500' : 'text-gray-900'}`}>
                      {routine.name}
                    </h3>
                    {routine.description && (
                      <p className={`text-sm mt-1 ${!routine.isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                        {routine.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {getFrequencyLabel(routine.frequency)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Completadas: {routineCompletions.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRoutine(routine.id, routine.isActive)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        routine.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {routine.isActive ? 'Activa' : 'Inactiva'}
                    </button>
                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${isCompletedToday ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-600">
                      {isCompletedToday ? 'Completada hoy' : 'Pendiente para hoy'}
                    </span>
                  </div>
                  {routine.isActive && !isCompletedToday && (
                    <button
                      onClick={() => completeRoutine(routine.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Marcar como completada
                    </button>
                  )}
                </div>

                {routineCompletions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Completaciones recientes</h4>
                    <div className="space-y-2">
                      {routineCompletions
                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                        .slice(0, 5)
                        .map((completion) => (
                          <div key={completion.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {new Date(completion.completedAt).toLocaleDateString()} a las {new Date(completion.completedAt).toLocaleTimeString()}
                            </span>
                            {completion.notes && (
                              <span className="text-gray-500">- {completion.notes}</span>
                            )}
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
