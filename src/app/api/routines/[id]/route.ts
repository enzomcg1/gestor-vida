import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const routine = await prisma.routine.update({
      where: { id },
      data: body
    })
    return NextResponse.json(routine)
  } catch (error) {
    console.error('Error updating routine:', error)
    return NextResponse.json({ error: 'Error updating routine' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.routine.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Routine deleted successfully' })
  } catch (error) {
    console.error('Error deleting routine:', error)
    return NextResponse.json({ error: 'Error deleting routine' }, { status: 500 })
  }
}
