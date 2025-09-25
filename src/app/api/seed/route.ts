import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Verificar si ya existen categorías
    const existingCategories = await prisma.category.findMany()
    if (existingCategories.length > 0) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    // Crear categorías por defecto
    const categories = await Promise.all([
      // Categorías de ingresos
      prisma.category.create({
        data: {
          name: 'Salario',
          type: 'INCOME',
          description: 'Ingresos por trabajo',
          color: '#10B981'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Freelance',
          type: 'INCOME',
          description: 'Trabajos independientes',
          color: '#059669'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Inversiones',
          type: 'INCOME',
          description: 'Rendimientos de inversiones',
          color: '#047857'
        }
      }),

      // Categorías de gastos
      prisma.category.create({
        data: {
          name: 'Alimentación',
          type: 'EXPENSE',
          description: 'Comida y bebidas',
          color: '#EF4444'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Transporte',
          type: 'EXPENSE',
          description: 'Gasolina, transporte público, taxi',
          color: '#F97316'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Vivienda',
          type: 'EXPENSE',
          description: 'Renta, servicios, mantenimiento',
          color: '#DC2626'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Entretenimiento',
          type: 'EXPENSE',
          description: 'Cine, deportes, hobbies',
          color: '#7C3AED'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Salud',
          type: 'EXPENSE',
          description: 'Medicamentos, consultas médicas',
          color: '#DB2777'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Educación',
          type: 'EXPENSE',
          description: 'Cursos, libros, capacitación',
          color: '#0891B2'
        }
      })
    ])

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      categoriesCreated: categories.length
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Error seeding database' }, { status: 500 })
  }
}

