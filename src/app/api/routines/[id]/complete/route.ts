import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const completion = await prisma.routineCompletion.create({
      data: {
        routineId: id,
        notes: body.notes,
      }
    })
    return NextResponse.json(completion)
  } catch (error) {
    console.error('Error completing routine:', error)
    return NextResponse.json({ error: 'Error completing routine' }, { status: 500 })
  }
}
