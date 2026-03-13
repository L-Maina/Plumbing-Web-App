import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function generateAIResponse(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  siteSettings: {
    businessName: string
    phone: string
    email: string
    address: string
    services: string[]
  }
): Promise<string> {
  if (!GROQ_API_KEY) {
    return "I'm sorry, I'm currently unable to process your request. Please call us directly at " + siteSettings.phone + " for immediate assistance."
  }

  const systemPrompt = `You are a helpful customer service assistant for ${siteSettings.businessName}, a professional plumbing company in Nairobi, Kenya.

Company Information:
- Business Name: ${siteSettings.businessName}
- Phone: ${siteSettings.phone}
- Email: ${siteSettings.email}
- Address: ${siteSettings.address}
- Services: ${siteSettings.services.join(', ')}

Guidelines:
1. Be helpful, friendly, and professional
2. Provide accurate plumbing advice when asked
3. Encourage customers to book appointments for complex issues
4. For emergencies, direct them to call ${siteSettings.phone}
5. Keep responses concise but informative (2-4 sentences)
6. If you can't help with something, direct them to contact the business directly
7. Never make up information about pricing or specific availability
8. Respond as if you represent ${siteSettings.businessName}

Remember: You're helping customers in Kenya, so use appropriate local context when relevant.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map(msg => ({
            role: msg.role === 'visitor' ? 'user' : 'assistant',
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again or call us directly."
  } catch (error) {
    console.error('AI response error:', error)
    return "I'm having trouble responding right now. Please call us at " + siteSettings.phone + " for immediate assistance."
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    
    const session = await db.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching chat session:', error)
    return NextResponse.json({ error: 'Failed to fetch chat session' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const body = await request.json()

    // Verify session exists
    const session = await db.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10,
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Save visitor message
    const visitorMessage = await db.chatMessage.create({
      data: {
        sessionId,
        content: body.message,
        sender: 'visitor',
        senderName: session.name || 'Visitor',
      },
    })

    // Update session last message time
    await db.chatSession.update({
      where: { id: sessionId },
      data: { lastMessageAt: new Date() },
    })

    // Get site settings and services for AI context
    const [settings, services] = await Promise.all([
      db.siteSettings.findFirst(),
      db.service.findMany({
        where: { isActive: true },
        select: { name: true },
      }),
    ])

    // Generate AI response
    const aiResponse = await generateAIResponse(
      body.message,
      session.messages.map(m => ({
        role: m.sender,
        content: m.content,
      })),
      {
        businessName: settings?.businessName || 'Climate Tech Plumbing',
        phone: settings?.phone || '0720 219802',
        email: settings?.email || 'info@climatetechplumbing.co.ke',
        address: settings?.address || 'Thika Rd, Nairobi, Kenya',
        services: services.map(s => s.name),
      }
    )

    // Save AI response
    const aiMessage = await db.chatMessage.create({
      data: {
        sessionId,
        content: aiResponse,
        sender: 'ai',
        senderName: 'AI Assistant',
      },
    })

    // Update session last message time
    await db.chatSession.update({
      where: { id: sessionId },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json({
      visitorMessage,
      aiMessage,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const body = await request.json()

    const session = await db.chatSession.update({
      where: { id: sessionId },
      data: {
        status: body.status,
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}
