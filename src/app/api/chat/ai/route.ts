import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface Message {
  sender: string;
  message: string;
}

const SYSTEM_PROMPT = `You are a helpful plumbing assistant for Climate Tech Plumbing & Renovators, a professional plumbing company in Nairobi, Kenya.

COMPANY INFO:
- Name: Climate Tech Plumbing & Renovators
- Phone: 0720 219802 (Available 24/7)
- Address: Thika Rd, Nairobi, Kenya
- Rating: 4.9/5 (32 reviews)
- Services: Plumbing installation, pipe repairs, water heater services, bathroom renovations, emergency plumbing, urinal installation, flush valves, paving slab repairs

YOUR ROLE:
- Help customers with plumbing questions and issues
- Provide helpful tips and guidance
- Encourage customers to book services when appropriate
- Be friendly, professional, and helpful
- Keep responses concise (2-4 sentences max)
- Use simple, clear language

IMPORTANT: Do NOT mention the website URL or say "visit our website". The customer is already on the website! Just help them directly or mention the phone number if they need to call.

WHEN TO REQUEST HUMAN INTERVENTION (set needsHuman: true):
1. Customer wants to book a specific service with date/time
2. Customer has a complex technical issue requiring expert assessment
3. Customer is asking about pricing for a specific job
4. Customer has a complaint or is unhappy
5. Customer explicitly asks to speak with a human
6. Customer needs emergency service right now
7. Customer provides their address or wants a site visit

RESPONSE FORMAT:
Always respond in a friendly, conversational tone. If suggesting to book, mention the phone number.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userMessage, conversationHistory = [], handoffRequested = false } = body;

    if (!userMessage) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // If handoff has been requested, AI should NOT respond
    // The customer is waiting for a human
    if (handoffRequested) {
      return NextResponse.json({
        success: true,
        response: "You're in the queue for a human assistant. Please wait a moment while we connect you to our plumbing expert.",
        needsHuman: true,
        aiDisabled: true
      });
    }

    const zai = await ZAI.create();

    // Build conversation context
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: SYSTEM_PROMPT }
    ];

    // Add conversation history
    for (const msg of conversationHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: userMessage
    });

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    let response = completion.choices[0]?.message?.content || "I'm here to help! How can I assist you with your plumbing needs?";
    let needsHuman = false;

    // Remove any website URLs that might slip through
    response = response.replace(/www\.[^\s]+/gi, '');
    response = response.replace(/https?:\/\/[^\s]+/gi, '');
    response = response.replace(/climate-tech\.co\.ke/gi, 'our company');

    // Additional keyword-based detection for human intervention
    const humanKeywords = [
      'book', 'appointment', 'schedule', 'emergency', 'now', 'urgent',
      'price', 'cost', 'quote', 'how much', 'come to', 'my house',
      'my home', 'address', 'visit', 'speak to', 'talk to', 'manager',
      'complaint', 'unhappy', 'not satisfied', 'problem', 'issue',
      'leak', 'burst', 'flood', 'no water', 'blocked', 'clogged'
    ];

    const lowerMessage = userMessage.toLowerCase();
    needsHuman = humanKeywords.some(keyword => lowerMessage.includes(keyword));

    return NextResponse.json({
      success: true,
      response: response.trim(),
      needsHuman
    });

  } catch (error) {
    console.error("Error in chat AI:", error);
    
    return NextResponse.json({
      success: false,
      response: "I'd be happy to help! For immediate assistance, please call us at 0720 219802. We're available 24/7!",
      needsHuman: true
    });
  }
}
