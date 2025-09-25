import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Buscar transacciones recurrentes que deben procesarse hoy
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        isActive: true,
        nextDueDate: {
          lte: today
        }
      },
      include: {
        category: true
      }
    })

    const processedTransactions = []

    for (const recurring of recurringTransactions) {
      // Verificar si ya se procesó este mes (para transacciones mensuales)
      if (recurring.frequency === 'MONTHLY') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        
        const existingTransaction = await prisma.transaction.findFirst({
          where: {
            recurringTransactionId: recurring.id,
            date: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        })

        if (existingTransaction) {
          continue // Ya se procesó este mes
        }
      }

      // Crear la transacción
      const transaction = await prisma.transaction.create({
        data: {
          amount: recurring.amount,
          description: recurring.name,
          type: recurring.type,
          date: today,
          categoryId: recurring.categoryId,
          recurringTransactionId: recurring.id
        }
      })

      // Calcular la próxima fecha de vencimiento
      const nextDueDate = calculateNextDueDate(
        recurring.frequency,
        recurring.dayOfMonth,
        today
      )

      // Actualizar la fecha de próximo vencimiento
      await prisma.recurringTransaction.update({
        where: { id: recurring.id },
        data: { nextDueDate }
      })

      processedTransactions.push({
        recurring: recurring,
        transaction: transaction
      })
    }

    return NextResponse.json({
      message: `Processed ${processedTransactions.length} recurring transactions`,
      processed: processedTransactions,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error processing recurring transactions:', error)
    return NextResponse.json({ error: 'Error processing recurring transactions' }, { status: 500 })
  }
}

function calculateNextDueDate(frequency: string, dayOfMonth: number | null, fromDate: Date): Date {
  const nextDate = new Date(fromDate)
  
  switch (frequency) {
    case 'MONTHLY':
      if (dayOfMonth) {
        nextDate.setDate(dayOfMonth)
        if (nextDate <= fromDate) {
          nextDate.setMonth(nextDate.getMonth() + 1)
        }
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1)
      }
      break
    case 'WEEKLY':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'YEARLY':
      nextDate.setFullYear(nextDate.getFullYear() + 1)
      break
  }
  
  return nextDate
}
