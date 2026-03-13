import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const serviceId = searchParams.get('serviceId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = { isApproved: true }

    if (featured === 'true') where.isFeatured = true
    if (serviceId) where.serviceId = serviceId

    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        service: {
          select: { name: true },
        },
      },
    })

    // Get aggregate stats
    const stats = await db.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
      _count: { id: true },
    })

    const ratingDistribution = await db.review.groupBy({
      by: ['rating'],
      where: { isApproved: true },
      _count: { rating: true },
    })

    return NextResponse.json({
      reviews,
      stats: {
        average: stats._avg.rating || 0,
        total: stats._count.id,
        distribution: ratingDistribution.reduce((acc, item) => {
          acc[item.rating] = item._count.rating
          return acc
        }, {} as Record<number, number>),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const review = await db.review.create({
      data: {
        name: body.name,
        email: body.email,
        rating: body.rating,
        title: body.title,
        comment: body.comment,
        serviceId: body.serviceId,
        bookingId: body.bookingId,
        isApproved: false, // Reviews need approval
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
