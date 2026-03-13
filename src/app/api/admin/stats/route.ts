import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get various statistics
    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      todayBookings,
      totalRevenue,
      monthlyRevenue,
      totalReviews,
      averageRating,
      totalSubscribers,
      activeChats,
      unreadMessages,
      recentBookings,
      recentContacts,
    ] = await Promise.all([
      // Total bookings
      db.booking.count(),
      
      // Pending bookings
      db.booking.count({ where: { status: 'pending' } }),
      
      // Completed bookings
      db.booking.count({ where: { status: 'completed' } }),
      
      // Today's bookings
      db.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      
      // Total revenue from completed bookings
      db.booking.aggregate({
        where: { status: 'completed', finalCost: { not: null } },
        _sum: { finalCost: true },
      }),
      
      // Monthly revenue
      db.booking.aggregate({
        where: {
          status: 'completed',
          finalCost: { not: null },
          completedAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
        _sum: { finalCost: true },
      }),
      
      // Total reviews
      db.review.count({ where: { isApproved: true } }),
      
      // Average rating
      db.review.aggregate({
        where: { isApproved: true },
        _avg: { rating: true },
      }),
      
      // Total subscribers
      db.newsletter.count({ where: { status: 'active' } }),
      
      // Active chat sessions
      db.chatSession.count({ where: { status: 'active' } }),
      
      // Unread messages
      db.chatMessage.count({
        where: { sender: 'visitor', isRead: false },
      }),
      
      // Recent bookings (last 5)
      db.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          service: { select: { name: true } },
        },
      }),
      
      // Recent contacts (last 5)
      db.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Booking status distribution
    const bookingStatusDistribution = await db.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyBookings = await db.booking.findMany({
      where: {
        status: 'completed',
        completedAt: { gte: sixMonthsAgo },
        finalCost: { not: null },
      },
      select: {
        finalCost: true,
        completedAt: true,
      },
    })

    // Group by month
    const revenueByMonth: Record<string, number> = {}
    monthlyBookings.forEach((booking) => {
      if (booking.completedAt && booking.finalCost) {
        const monthKey = booking.completedAt.toISOString().slice(0, 7)
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + booking.finalCost
      }
    })

    return NextResponse.json({
      overview: {
        totalBookings,
        pendingBookings,
        completedBookings,
        todayBookings,
        totalRevenue: totalRevenue._sum.finalCost || 0,
        monthlyRevenue: monthlyRevenue._sum.finalCost || 0,
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
        totalSubscribers,
        activeChats,
        unreadMessages,
      },
      charts: {
        bookingStatusDistribution: bookingStatusDistribution.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
        revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
          month,
          revenue,
        })),
      },
      recent: {
        bookings: recentBookings,
        contacts: recentContacts,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
