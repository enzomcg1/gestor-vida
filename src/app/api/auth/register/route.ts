import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validar datos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        emailVerified: new Date()
      }
    })

    // Crear categorías por defecto para el nuevo usuario
    await Promise.all([
      prisma.category.create({
        data: {
          name: 'Salario',
          type: 'INCOME',
          description: 'Ingresos por trabajo',
          color: '#10B981',
          userId: user.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Freelance',
          type: 'INCOME',
          description: 'Trabajos independientes',
          color: '#3B82F6',
          userId: user.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Alimentación',
          type: 'EXPENSE',
          description: 'Gastos en comida',
          color: '#F59E0B',
          userId: user.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Transporte',
          type: 'EXPENSE',
          description: 'Gastos de movilidad',
          color: '#EF4444',
          userId: user.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Entretenimiento',
          type: 'EXPENSE',
          description: 'Diversión y ocio',
          color: '#8B5CF6',
          userId: user.id
        }
      })
    ])

    return NextResponse.json(
      { message: 'Usuario creado exitosamente' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
