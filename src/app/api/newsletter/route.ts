import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where = status ? { status } : {}

    const [subscribers, total] = await Promise.all([
      db.newsletter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      db.newsletter.count({ where }),
    ])

    return NextResponse.json({ subscribers, total })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check if email already exists
    const existing = await db.newsletter.findUnique({
      where: { email: body.email },
    })

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Resubscribe
        const updated = await db.newsletter.update({
          where: { id: existing.id },
          data: {
            status: 'active',
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        })
        return NextResponse.json(updated)
      }
      return NextResponse.json({ 
        error: 'Email already subscribed',
        subscriber: existing 
      }, { status: 400 })
    }

    const subscriber = await db.newsletter.create({
      data: {
        email: body.email,
        name: body.name,
        source: body.source || 'website',
      },
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    console.error('Error creating subscriber:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
