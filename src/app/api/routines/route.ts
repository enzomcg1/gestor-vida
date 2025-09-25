import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routines = await prisma.routine.findMany({
      where: { userId: session.user.id },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(routines)
  } catch (error) {
    console.error('Error fetching routines:', error)
    return NextResponse.json({ error: 'Error fetching routines' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const routine = await prisma.routine.create({
      data: {
        name: body.name,
        description: body.description,
        frequency: body.frequency,
        isActive: body.isActive !== undefined ? body.isActive : true,
        userId: session.user.id,
      }
    })
    return NextResponse.json(routine)
  } catch (error) {
    console.error('Error creating routine:', error)
    return NextResponse.json({ error: 'Error creating routine' }, { status: 500 })
  }
}

