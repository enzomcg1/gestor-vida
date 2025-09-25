import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Si se actualiza la frecuencia o día del mes, recalcular nextDueDate
    let updateData = { ...body }
    if (body.frequency || body.dayOfMonth !== undefined) {
      const current = await prisma.recurringTransaction.findUnique({
        where: { id }
      })
      
      if (current) {
        const frequency = body.frequency || current.frequency
        const dayOfMonth = body.dayOfMonth !== undefined ? body.dayOfMonth : current.dayOfMonth
        updateData.nextDueDate = calculateNextDueDate(frequency, dayOfMonth, new Date())
      }
    }

    const recurringTransaction = await prisma.recurringTransaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 5
        }
      }
    })
    return NextResponse.json(recurringTransaction)
  } catch (error) {
    console.error('Error updating recurring transaction:', error)
    return NextResponse.json({ error: 'Error updating recurring transaction' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.recurringTransaction.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Recurring transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting recurring transaction:', error)
    return NextResponse.json({ error: 'Error deleting recurring transaction' }, { status: 500 })
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
