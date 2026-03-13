import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await db.chatSession.findMany({
      orderBy: { lastMessageAt: 'desc' },
      take: 50,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    // Get unread counts
    const unreadCounts = await db.chatMessage.groupBy({
      by: ['sessionId'],
      where: {
        sender: 'visitor',
        isRead: false,
      },
      _count: { id: true },
    })

    const unreadMap = unreadCounts.reduce((acc, item) => {
      acc[item.sessionId] = item._count.id
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        ...s,
        unreadCount: unreadMap[s.id] || 0,
      })),
    })
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const session = await db.chatSession.create({
      data: {
        visitorId: body.visitorId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        source: body.source || 'website',
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating chat session:', error)
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 })
  }
}
