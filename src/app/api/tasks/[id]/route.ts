import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const task = await prisma.task.update({
      where: { id },
      data: body
    })
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Error updating task' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.task.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Error deleting task' }, { status: 500 })
  }
}
