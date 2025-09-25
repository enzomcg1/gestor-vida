import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.savingsGoal.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Savings goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting savings goal:', error)
    return NextResponse.json({ error: 'Error deleting savings goal' }, { status: 500 })
  }
}
