import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        service: true,
        reviews: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
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

    if (body.status) updateData.status = body.status
    if (body.priority) updateData.priority = body.priority
    if (body.estimatedCost !== undefined) updateData.estimatedCost = body.estimatedCost
    if (body.finalCost !== undefined) updateData.finalCost = body.finalCost
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes
    if (body.cancelReason !== undefined) updateData.cancelReason = body.cancelReason

    // Handle status-specific timestamps
    if (body.status === 'confirmed') updateData.confirmedAt = new Date()
    if (body.status === 'completed') updateData.completedAt = new Date()
    if (body.status === 'cancelled') updateData.cancelledAt = new Date()

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.booking.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
