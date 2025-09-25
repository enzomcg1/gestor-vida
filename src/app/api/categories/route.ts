import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const category = await prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        description: body.description,
        color: body.color,
        userId: session.user.id,
      }
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 })
  }
}

