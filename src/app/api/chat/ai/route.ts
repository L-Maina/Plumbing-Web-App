import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ response: "AI service unavailable. Please call us directly!" });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for Climate Tech Plumbing & Renovators in Nairobi, Kenya. We offer plumbing, borehole drilling, water heater installation, bathroom renovations, and emergency services. Phone: 0720 219802. Be concise and helpful. If someone needs immediate help or has a complex issue, suggest they call us directly."
          },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || "I apologize, I couldn't process that. Please call us at 0720 219802.";

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ response: "I'm having trouble connecting. Please call 0720 219802 for immediate assistance." });
  }
}
