import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 5 // Últimas 5 transacciones generadas
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(recurringTransactions)
  } catch (error) {
    console.error('Error fetching recurring transactions:', error)
    return NextResponse.json({ error: 'Error fetching recurring transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Calcular la próxima fecha de vencimiento
    const nextDueDate = calculateNextDueDate(
      body.frequency,
      body.dayOfMonth,
      new Date()
    )

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        name: body.name,
        description: body.description,
        amount: parseFloat(body.amount),
        type: body.type,
        categoryId: body.categoryId,
        frequency: body.frequency,
        dayOfMonth: body.dayOfMonth,
        isActive: body.isActive !== undefined ? body.isActive : true,
        nextDueDate: nextDueDate,
        userId: session.user.id,
      },
      include: {
        category: true
      }
    })
    return NextResponse.json(recurringTransaction)
  } catch (error) {
    console.error('Error creating recurring transaction:', error)
    return NextResponse.json({ error: 'Error creating recurring transaction' }, { status: 500 })
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
