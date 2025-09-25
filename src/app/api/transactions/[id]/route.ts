import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.transaction.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 })
  }
}
