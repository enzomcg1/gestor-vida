'use client'

import { useState, useEffect } from 'react'
import { formatGuaranies } from '@/lib/utils'

type TransactionType = 'INCOME' | 'EXPENSE'
type CategoryType = 'INCOME' | 'EXPENSE'
type RecurringFrequency = 'MONTHLY' | 'WEEKLY' | 'YEARLY'

interface Transaction {
  id: string
  amount: number
  description: string
  type: TransactionType
  date: Date
  categoryId: string
  recurringTransactionId?: string
  category: {
    id: string
    name: string
    type: CategoryType
    color?: string
  }
}

interface Category {
  id: string
  name: string
  type: CategoryType
  color?: string
  description?: string
}

interface RecurringTransaction {
  id: string
  name: string
  description?: string
  amount: number
  type: TransactionType
  categoryId: string
  frequency: RecurringFrequency
  dayOfMonth?: number
  isActive: boolean
  nextDueDate?: Date
  category: {
    id: string
    name: string
    type: CategoryType
    color?: string
  }
  transactions: Transaction[]
}

export default function FinanzasPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showRecurringForm, setShowRecurringForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'transactions' | 'recurring'>('transactions')
  const [loading, setLoading] = useState(true)
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    type: 'EXPENSE' as TransactionType,
    date: new Date().toISOString().slice(0, 16),
    categoryId: ''
  })
  const [newRecurringTransaction, setNewRecurringTransaction] = useState({
    name: '',
    description: '',
    amount: '',
    type: 'EXPENSE' as TransactionType,
    categoryId: '',
    frequency: 'MONTHLY' as RecurringFrequency,
    dayOfMonth: 1,
    isActive: true
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [transactionsRes, recurringRes, categoriesRes] = await Promise.all([
        fetch('/api/transactions', { credentials: 'include' }),
        fetch('/api/recurring-transactions', { credentials: 'include' }),
        fetch('/api/categories', { credentials: 'include' })
      ])

      if (transactionsRes.ok && recurringRes.ok && categoriesRes.ok) {
        const [transactionsData, recurringData, categoriesData] = await Promise.all([
          transactionsRes.json(),
          recurringRes.json(),
          categoriesRes.json()
        ])
        setTransactions(transactionsData)
        setRecurringTransactions(recurringData)
        setCategories(categoriesData)
      } else {
        console.error('Error fetching data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.categoryId) return

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          type: newTransaction.type,
          date: newTransaction.date,
          categoryId: newTransaction.categoryId,
        }),
      })

      if (response.ok) {
        await fetchData() // Recargar los datos
        setNewTransaction({
          amount: '',
          description: '',
          type: 'EXPENSE',
          date: new Date().toISOString().slice(0, 16),
          categoryId: ''
        })
        setShowForm(false)
      } else {
        console.error('Error creating transaction')
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  const deleteTransaction = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta transacción?')) return

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData() // Recargar los datos
      } else {
        console.error('Error deleting transaction')
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const handleRecurringSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecurringTransaction.name || !newRecurringTransaction.amount || !newRecurringTransaction.categoryId) return

    try {
      const response = await fetch('/api/recurring-transactions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRecurringTransaction.name,
          description: newRecurringTransaction.description || null,
          amount: parseFloat(newRecurringTransaction.amount),
          type: newRecurringTransaction.type,
          categoryId: newRecurringTransaction.categoryId,
          frequency: newRecurringTransaction.frequency,
          dayOfMonth: newRecurringTransaction.frequency === 'MONTHLY' ? newRecurringTransaction.dayOfMonth : null,
          isActive: newRecurringTransaction.isActive,
        }),
      })

      if (response.ok) {
        await fetchData() // Recargar los datos
        setNewRecurringTransaction({
          name: '',
          description: '',
          amount: '',
          type: 'EXPENSE',
          categoryId: '',
          frequency: 'MONTHLY',
          dayOfMonth: 1,
          isActive: true
        })
        setShowRecurringForm(false)
      } else {
        console.error('Error creating recurring transaction')
      }
    } catch (error) {
      console.error('Error creating recurring transaction:', error)
    }
  }

  const toggleRecurringTransaction = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentActive,
        }),
      })

      if (response.ok) {
        await fetchData() // Recargar los datos
      } else {
        console.error('Error updating recurring transaction')
      }
    } catch (error) {
      console.error('Error updating recurring transaction:', error)
    }
  }

  const deleteRecurringTransaction = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta transacción recurrente?')) return

    try {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData() // Recargar los datos
      } else {
        console.error('Error deleting recurring transaction')
      }
    } catch (error) {
      console.error('Error deleting recurring transaction:', error)
    }
  }

  const processRecurringTransactions = async () => {
    try {
      const response = await fetch('/api/recurring-transactions/process', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Se procesaron ${result.processed.length} transacciones recurrentes`)
        await fetchData() // Recargar los datos
      } else {
        console.error('Error processing recurring transactions')
      }
    } catch (error) {
      console.error('Error processing recurring transactions:', error)
    }
  }

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  const getFilteredCategories = (type: CategoryType) => {
    return categories.filter(c => c.type === type)
  }

  const getFrequencyLabel = (frequency: RecurringFrequency) => {
    switch (frequency) {
      case 'MONTHLY': return 'Mensual'
      case 'WEEKLY': return 'Semanal'
      case 'YEARLY': return 'Anual'
      default: return frequency
    }
  }

  const getRecurringTotalIncome = () => {
    return recurringTransactions
      .filter(rt => rt.type === 'INCOME' && rt.isActive)
      .reduce((sum, rt) => sum + rt.amount, 0)
  }

  const getRecurringTotalExpenses = () => {
    return recurringTransactions
      .filter(rt => rt.type === 'EXPENSE' && rt.isActive)
      .reduce((sum, rt) => sum + rt.amount, 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando finanzas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finanzas</h1>
          <p className="mt-2 text-gray-600">Controla tus ingresos y gastos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={processRecurringTransactions}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Procesar Recurrentes
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Transacción
          </button>
        </div>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transacciones
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recurring'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recurrentes
          </button>
        </nav>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">{formatGuaranies(getTotalIncome())}</p>
              {getRecurringTotalIncome() > 0 && (
                <p className="text-xs text-gray-500">+ {formatGuaranies(getRecurringTotalIncome())}/mes recurrentes</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">💸</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gastos</p>
              <p className="text-2xl font-bold text-red-600">{formatGuaranies(getTotalExpenses())}</p>
              {getRecurringTotalExpenses() > 0 && (
                <p className="text-xs text-gray-500">+ {formatGuaranies(getRecurringTotalExpenses())}/mes recurrentes</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatGuaranies(getBalance())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Nueva Transacción</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType, categoryId: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="EXPENSE">Gasto</option>
                  <option value="INCOME">Ingreso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  value={newTransaction.categoryId}
                  onChange={(e) => setNewTransaction({ ...newTransaction, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {getFilteredCategories(newTransaction.type).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Descripción de la transacción"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="datetime-local"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Agregar Transacción
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

      {/* Formulario para transacciones recurrentes */}
      {showRecurringForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Nueva Transacción Recurrente</h2>
          <form onSubmit={handleRecurringSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newRecurringTransaction.name}
                  onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ej: Salario mensual"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={newRecurringTransaction.type}
                  onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, type: e.target.value as TransactionType, categoryId: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="EXPENSE">Gasto</option>
                  <option value="INCOME">Ingreso</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  value={newRecurringTransaction.categoryId}
                  onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {getFilteredCategories(newRecurringTransaction.type).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia *
                </label>
                <select
                  value={newRecurringTransaction.frequency}
                  onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, frequency: e.target.value as RecurringFrequency })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="MONTHLY">Mensual</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRecurringTransaction.amount}
                  onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="0.00"
                  required
                />
              </div>

              {newRecurringTransaction.frequency === 'MONTHLY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Día del mes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newRecurringTransaction.dayOfMonth}
                    onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, dayOfMonth: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={newRecurringTransaction.description}
                onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                rows={3}
                placeholder="Descripción adicional..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear Recurrente
              </button>
              <button
                type="button"
                onClick={() => setShowRecurringForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contenido de las pestañas */}
      {activeTab === 'transactions' && (
        <>
          {/* Lista de transacciones */}
          <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Transacciones</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hay transacciones registradas</p>
              <p className="text-sm mt-1">Agrega tu primera transacción para comenzar</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: transaction.category.color || '#6B7280' }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.category.name} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}{formatGuaranies(transaction.amount)}
                    </p>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
        </>
      )}

      {activeTab === 'recurring' && (
        <>
          {/* Botón para agregar transacción recurrente */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowRecurringForm(!showRecurringForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Nueva Recurrente
            </button>
          </div>

          {/* Lista de transacciones recurrentes */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Transacciones Recurrentes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recurringTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No hay transacciones recurrentes configuradas</p>
                  <p className="text-sm mt-1">Crea tu primera transacción recurrente para automatizar tus finanzas</p>
                </div>
              ) : (
                recurringTransactions.map((recurring) => (
                  <div key={recurring.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: recurring.category.color || '#6B7280' }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{recurring.name}</p>
                          <p className="text-sm text-gray-600">
                            {recurring.category.name} • {getFrequencyLabel(recurring.frequency)}
                            {recurring.frequency === 'MONTHLY' && recurring.dayOfMonth && (
                              <span> • Día {recurring.dayOfMonth}</span>
                            )}
                          </p>
                          {recurring.description && (
                            <p className="text-sm text-gray-500 mt-1">{recurring.description}</p>
                          )}
                          {recurring.nextDueDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Próximo: {new Date(recurring.nextDueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className={`font-semibold ${recurring.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {recurring.type === 'INCOME' ? '+' : '-'}{formatGuaranies(recurring.amount)}
                        </p>
                        <button
                          onClick={() => toggleRecurringTransaction(recurring.id, recurring.isActive)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            recurring.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {recurring.isActive ? 'Activa' : 'Inactiva'}
                        </button>
                        <button
                          onClick={() => deleteRecurringTransaction(recurring.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Historial de transacciones generadas */}
                    {recurring.transactions.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Últimas transacciones generadas</h4>
                        <div className="space-y-2">
                          {recurring.transactions.slice(0, 3).map((transaction) => (
                            <div key={transaction.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {new Date(transaction.date).toLocaleDateString()}
                              </span>
                              <span className={`font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'INCOME' ? '+' : '-'}{formatGuaranies(transaction.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}