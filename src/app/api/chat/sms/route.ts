import { NextRequest, NextResponse } from "next/server";

// Demo phone for testing (your phone number)
const DEMO_PHONE = "0706605553";

// Africa's Talking configuration
const AT_USERNAME = process.env.AFRICASTALKING_USERNAME || "sandbox";
const AT_API_KEY = process.env.AFRICASTALKING_API_KEY;

// SMS service instance
let smsService: { send: (options: { to: string[]; message: string; from?: string }) => Promise<unknown> } | null = null;

// Initialize Africa's Talking (only if API key is configured)
async function initializeATSMS() {
  try {
    const AfricasTalking = (await import('africastalking')).default;
    const at = AfricasTalking({
      username: AT_USERNAME,
      apiKey: AT_API_KEY || '',
    });
    return at.SMS;
  } catch (error) {
    console.error('Failed to initialize Africa\'s Talking:', error);
    return null;
  }
}

// Format phone number for Africa's Talking (+254 format)
function formatPhone(phone: string): string {
  // Remove any spaces or dashes
  let cleaned = phone.replace(/[\s-]/g, '');
  
  // Convert 07XX to +2547XX
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.substring(1);
  }
  
  // Convert 254 to +254
  if (cleaned.startsWith('254') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  // If no +, add it
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

// SMS notification endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Phone and message are required" },
        { status: 400 }
      );
    }

    // Use demo phone for testing
    const targetPhone = formatPhone(DEMO_PHONE);
    
    // Try to initialize if not already done
    if (!smsService && AT_API_KEY && AT_API_KEY !== 'your_api_key_here') {
      smsService = await initializeATSMS();
    }
    
    // Check if Africa's Talking is configured
    if (smsService) {
      try {
        // Send real SMS via Africa's Talking
        const result = await smsService.send({
          to: [targetPhone],
          message: message,
        });
        
        console.log('\n');
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║            📱 SMS SENT VIA AFRICA\'S TALKING               ║');
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log(`║  To: ${targetPhone.padEnd(48)}║`);
        console.log(`║  Status: SUCCESS                                          ║`);
        console.log(`║  Time: ${new Date().toLocaleString().padEnd(46)}║`);
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log(`║  Message:                                                 ║`);
        console.log(`║  ${message.substring(0, 56).padEnd(56)}║`);
        console.log('╚══════════════════════════════════════════════════════════╝');
        console.log('\n');
        
        return NextResponse.json({ 
          success: true, 
          message: "SMS sent successfully!",
          sentTo: targetPhone,
          provider: "Africa's Talking",
          result: result
        });
      } catch (smsError) {
        console.error('Africa\'s Talking SMS Error:', smsError);
        
        // Fallback to demo mode on error
        return NextResponse.json({ 
          success: false, 
          error: "Failed to send SMS via Africa's Talking",
          details: smsError instanceof Error ? smsError.message : 'Unknown error',
          demo: true
        }, { status: 500 });
      }
    } else {
      // Demo mode - just log to console
      console.log('\n');
      console.log('╔══════════════════════════════════════════════════════════╗');
      console.log('║              📱 SMS NOTIFICATION (DEMO MODE)              ║');
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log(`║  To: ${targetPhone.padEnd(48)}║`);
      console.log(`║  Time: ${new Date().toLocaleString().padEnd(46)}║`);
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log(`║  Message:                                                 ║`);
      console.log(`║  ${message.substring(0, 56).padEnd(56)}║`);
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log('║  ⚠️  CONFIGURE AFRICA\'S TALKING FOR REAL SMS:            ║');
      console.log('║  1. Go to https://account.africastalking.com             ║');
      console.log('║  2. Create a free sandbox account                        ║');
      console.log('║  3. Get your API key from Settings                       ║');
      console.log('║  4. Add AFRICASTALKING_API_KEY to .env file              ║');
      console.log('╚══════════════════════════════════════════════════════════╝');
      console.log('\n');
      
      return NextResponse.json({ 
        success: true, 
        message: "SMS logged (demo mode)",
        sentTo: targetPhone,
        demo: true,
        note: "Configure Africa's Talking API key in .env for real SMS delivery"
      });
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
