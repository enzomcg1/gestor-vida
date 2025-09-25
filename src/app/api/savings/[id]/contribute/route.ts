import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Crear la contribución
    const contribution = await prisma.savingsContribution.create({
      data: {
        savingsGoalId: id,
        amount: parseFloat(body.amount),
        description: body.description,
        date: body.date ? new Date(body.date) : new Date(),
      }
    })

    // Actualizar el monto actual de la meta de ahorro
    const updatedGoal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: {
          increment: parseFloat(body.amount)
        }
      }
    })

    return NextResponse.json({ contribution, updatedGoal })
  } catch (error) {
    console.error('Error adding contribution:', error)
    return NextResponse.json({ error: 'Error adding contribution' }, { status: 500 })
  }
}
