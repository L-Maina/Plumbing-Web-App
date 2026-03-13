import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const review = await db.review.findUnique({
      where: { id },
      include: {
        service: true,
        booking: true,
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.rating !== undefined) updateData.rating = body.rating
    if (body.title !== undefined) updateData.title = body.title
    if (body.comment !== undefined) updateData.comment = body.comment
    if (body.isVerified !== undefined) updateData.isVerified = body.isVerified
    if (body.isApproved !== undefined) updateData.isApproved = body.isApproved
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured
    if (body.response !== undefined) {
      updateData.response = body.response
      updateData.respondedAt = new Date()
    }

    const review = await db.review.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.review.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
