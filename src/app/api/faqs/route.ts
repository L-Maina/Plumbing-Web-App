import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('active') !== 'false'

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (activeOnly) where.isActive = true

    const faqs = await db.faq.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const faq = await db.faq.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category,
        displayOrder: body.displayOrder || 0,
        isActive: body.isActive ?? true,
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
