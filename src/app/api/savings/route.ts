import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savingsGoals = await prisma.savingsGoal.findMany({
      where: { userId: session.user.id },
      include: {
        contributions: {
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(savingsGoals)
  } catch (error) {
    console.error('Error fetching savings goals:', error)
    return NextResponse.json({ error: 'Error fetching savings goals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const savingsGoal = await prisma.savingsGoal.create({
      data: {
        name: body.name,
        description: body.description,
        targetAmount: parseFloat(body.targetAmount),
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
        userId: session.user.id,
      }
    })
    return NextResponse.json(savingsGoal)
  } catch (error) {
    console.error('Error creating savings goal:', error)
    return NextResponse.json({ error: 'Error creating savings goal' }, { status: 500 })
  }
}

