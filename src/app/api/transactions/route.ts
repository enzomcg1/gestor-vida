import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: {
        category: true
      },
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(body.amount),
        description: body.description,
        type: body.type,
        date: body.date ? new Date(body.date) : new Date(),
        categoryId: body.categoryId,
        userId: session.user.id,
      },
      include: {
        category: true
      }
    })
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 })
  }
}

