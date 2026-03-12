import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

// Admin contact info
const ADMIN_PHONE = process.env.ADMIN_PHONE || "+254706605553";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "liammaina@icloud.com";

// Africa's Talking configuration
const AFRICASTALKING_API_KEY = process.env.AFRICASTALKING_API_KEY;
const AFRICASTALKING_USERNAME = process.env.AFRICASTALKING_USERNAME || "sandbox";
const AFRICASTALKING_SENDER_ID = process.env.AFRICASTALKING_SENDER_ID;

// Resend configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Africa's Talking API endpoint
const AT_ENDPOINT = AFRICASTALKING_USERNAME === "sandbox" 
  ? "https://api.sandbox.africastalking.com/version1/messaging"
  : "https://api.africastalking.com/version1/messaging";

// Format phone number for Africa's Talking (+254 format for Kenya)
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s-]/g, '');
  
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    cleaned = '+' + cleaned;
  } else {
    cleaned = '+254' + cleaned;
  }
  
  return cleaned;
}

// Send SMS via Africa's Talking
async function sendSMS(phone: string, message: string) {
  const targetPhone = formatPhone(phone);
  
  if (!AFRICASTALKING_API_KEY) {
    console.log('\n📱 SMS (Demo - Africa\'s Talking not configured)');
    console.log(`To: ${targetPhone}`);
    console.log(`Message: ${message.substring(0, 100)}...`);
    return { success: true, sentTo: targetPhone, demo: true };
  }
  
  try {
    const formData = new URLSearchParams();
    formData.append('username', AFRICASTALKING_USERNAME);
    formData.append('to', targetPhone);
    formData.append('message', message);
    
    // Only add sender ID in production (not sandbox)
    if (AFRICASTALKING_SENDER_ID && AFRICASTALKING_USERNAME !== 'sandbox') {
      formData.append('from', AFRICASTALKING_SENDER_ID);
    }
    
    console.log(`\n📱 Sending SMS via Africa's Talking to ${targetPhone}...`);
    
    const response = await fetch(AT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'ApiKey': AFRICASTALKING_API_KEY,
      },
      body: formData.toString(),
    });
    
    const responseText = await response.text();
    console.log(`Africa's Talking Response (${response.status}):`, responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error('❌ Could not parse response as JSON');
      return { success: false, error: 'Invalid JSON response', raw: responseText };
    }
    
    if (result.SMSMessageData?.Recipients) {
      const recipients = result.SMSMessageData.Recipients;
      const firstRecipient = recipients[0];
      const success = firstRecipient?.status === 'Success' || firstRecipient?.statusCode === 101;
      
      console.log(`✅ SMS ${success ? 'SENT' : 'FAILED'} via Africa's Talking`);
      console.log(`To: ${targetPhone} | Cost: ${firstRecipient?.cost || 'N/A'}`);
      
      return { 
        success, 
        sentTo: targetPhone, 
        provider: "Africa's Talking",
        cost: firstRecipient?.cost,
        messageId: firstRecipient?.messageId,
        data: result 
      };
    } else {
      console.error('❌ Africa\'s Talking Error:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('❌ Africa\'s Talking Error:', error);
    return { success: false, error: String(error) };
  }
}

// Send Email via Resend
async function sendEmail(to: string, subject: string, htmlContent: string, textContent: string) {
  if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here') {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(RESEND_API_KEY);
      
      // In trial mode, use onboarding@resend.dev as sender
      const result = await resend.emails.send({
        from: 'Climate Tech Plumbing <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: htmlContent,
        text: textContent,
      });
      
      if (result.error) {
        console.error('❌ Resend Error:', result.error);
        return { success: false, error: result.error.message };
      }
      
      console.log('\n📧 EMAIL SENT VIA RESEND');
      console.log(`To: ${to} | ID: ${result.data?.id}`);
      
      return { success: true, sentTo: to, provider: "Resend", id: result.data?.id };
    } catch (error) {
      console.error('❌ Resend Error:', error);
      return { success: false, error: String(error) };
    }
  } else {
    console.log('\n📧 EMAIL (Demo - Resend not configured)');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${textContent.substring(0, 100)}...`);
    return { success: true, sentTo: to, demo: true };
  }
}

// Generate notification content using LLM
async function generateContent(prompt: string, systemPrompt: string) {
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });
    return completion.choices[0]?.message?.content || '';
  } catch {
    return null;
  }
}

// ============ NOTIFICATION ENDPOINT ============

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    let result: { success: boolean; message: string; sms?: unknown; email?: unknown } = { 
      success: false, 
      message: '' 
    };
    
    switch (type) {
      case 'new_booking': {
        // Send SMS to Admin
        const adminSms = `🔔 NEW BOOKING!\nCustomer: ${data.name}\nService: ${data.service}\nDate: ${data.date} at ${data.time}\nPhone: ${data.phone}\nEmail: ${data.email || 'N/A'}\n\nCheck admin dashboard to confirm.`;
        const smsResult = await sendSMS(ADMIN_PHONE, adminSms);
        
        // Notify ADMIN about new booking via Email
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">🔔 New Booking Received!</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Customer:</strong> ${data.name}</p>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
              ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
              ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
            </div>
            <p style="color: #666;">Open your admin dashboard to confirm this booking.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #888; font-size: 12px;">Climate Tech Plumbing & Renovators<br>📞 0720 219802 | Thika Rd, Nairobi</p>
          </div>
        `;
        
        const emailText = `NEW BOOKING!\n\nCustomer: ${data.name}\nService: ${data.service}\nDate: ${data.date}\nTime: ${data.time}\nPhone: ${data.phone}\nEmail: ${data.email || 'Not provided'}\n${data.address ? `Address: ${data.address}\n` : ''}${data.notes ? `Notes: ${data.notes}\n` : ''}\nOpen admin dashboard to confirm.`;
        
        const emailResult = await sendEmail(
          ADMIN_EMAIL,
          `🔔 New Booking: ${data.service} - ${data.name}`,
          emailHtml,
          emailText
        );
        
        result = {
          success: true,
          message: 'Admin notified of new booking',
          sms: smsResult,
          email: emailResult
        };
        break;
      }
      
      case 'new_contact': {
        // Send SMS to Admin
        const adminSms = `📬 NEW MESSAGE!\nFrom: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nSubject: ${data.subject}\n\nMessage: ${data.message?.substring(0, 80) || 'N/A'}...`;
        const smsResult = await sendSMS(ADMIN_PHONE, adminSms);
        
        // Notify ADMIN about new contact via Email
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">📬 New Contact Message</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>From:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
              ${data.message ? `<p><strong>Message:</strong><br>${data.message}</p>` : ''}
            </div>
            <p style="color: #666;">Open your admin dashboard to respond.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #888; font-size: 12px;">Climate Tech Plumbing & Renovators</p>
          </div>
        `;
        
        const emailText = `NEW MESSAGE!\n\nFrom: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nSubject: ${data.subject}\n${data.message ? `\nMessage:\n${data.message}` : ''}`;
        
        const emailResult = await sendEmail(
          ADMIN_EMAIL,
          `📬 New Message: ${data.subject}`,
          emailHtml,
          emailText
        );
        
        result = {
          success: true,
          message: 'Admin notified of new contact',
          sms: smsResult,
          email: emailResult
        };
        break;
      }
      
      case 'chat_handoff': {
        // Send SMS to Admin (urgent)
        const adminSms = `⚠️ LIVE CHAT REQUEST!\nCustomer: ${data.customerName || 'Guest'}\n\nA customer needs human assistance NOW!\n\nOpen admin dashboard immediately.`;
        const smsResult = await sendSMS(ADMIN_PHONE, adminSms);
        
        // Notify ADMIN about chat handoff via Email
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">💬 Live Chat Request</h2>
            <div style="background: #fffbeb; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #f59e0b;">
              <p style="font-size: 18px;"><strong>Customer:</strong> ${data.customerName || 'Guest'}</p>
              <p style="color: #f59e0b; font-weight: bold;">⚠️ A customer is waiting for human assistance!</p>
            </div>
            <p style="font-size: 16px; color: #666;">Open your admin dashboard immediately to respond.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #888; font-size: 12px;">Climate Tech Plumbing & Renovators</p>
          </div>
        `;
        
        const emailText = `LIVE CHAT REQUEST!\n\nCustomer: ${data.customerName || 'Guest'}\n\nOpen admin dashboard immediately to respond.`;
        
        const emailResult = await sendEmail(
          ADMIN_EMAIL,
          `💬 Live Chat: ${data.customerName || 'Guest'} needs help!`,
          emailHtml,
          emailText
        );
        
        result = {
          success: true,
          message: 'Admin notified of chat handoff',
          sms: smsResult,
          email: emailResult
        };
        break;
      }
      
      case 'booking_confirmed': {
        // Notify CUSTOMER that their booking is confirmed
        const { bookingId } = data;
        const booking = await db.booking.findUnique({ where: { id: bookingId } });
        
        if (!booking) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }
        
        // Send SMS to Customer
        const customerSms = `Hi ${booking.name}! ✅ Your ${booking.service} booking is CONFIRMED for ${booking.date} at ${booking.time}. Our team will arrive at ${booking.address}. Questions? Call 0720 219802. - Climate Tech Plumbing`;
        const smsResult = await sendSMS(booking.phone, customerSms);
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">✅ Booking Confirmed!</h1>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 18px;">Dear ${booking.name},</p>
              <p>Your booking has been <strong style="color: #059669;">confirmed</strong>! Here are your details:</p>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #059669;">
                <p style="margin: 5px 0;"><strong>🔧 Service:</strong> ${booking.service}</p>
                <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${booking.date}</p>
                <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${booking.time}</p>
                <p style="margin: 5px 0;"><strong>📍 Address:</strong> ${booking.address}</p>
                ${booking.notes ? `<p style="margin: 5px 0;"><strong>📝 Notes:</strong> ${booking.notes}</p>` : ''}
              </div>
              
              <p>Our professional team will arrive on time. If you have any questions or need to reschedule, please contact us:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 24px; color: #059669; font-weight: bold;">📞 0720 219802</p>
                <p style="color: #666;">Available 24/7 for emergencies</p>
              </div>
              
              <p style="color: #666;">Thank you for choosing <strong>Climate Tech Plumbing & Renovators</strong>!</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
              <p>Climate Tech Plumbing & Renovators</p>
              <p>Thika Rd, Nairobi, Kenya | 📞 0720 219802</p>
            </div>
          </div>
        `;
        
        const emailText = `BOOKING CONFIRMED!\n\nDear ${booking.name},\n\nYour ${booking.service} booking is CONFIRMED!\n\n📅 Date: ${booking.date}\n⏰ Time: ${booking.time}\n📍 Address: ${booking.address}\n\nOur team will arrive on time. Questions? Call 0720 219802.\n\nThank you for choosing Climate Tech Plumbing & Renovators!`;
        
        // Try to send email to customer
        const emailResult = await sendEmail(
          booking.email,
          `✅ Booking Confirmed - ${booking.service}`,
          emailHtml,
          emailText
        );
        
        // If Resend trial mode error, also send to admin as backup
        if (!emailResult.success && emailResult.error?.includes('validation')) {
          console.log('⚠️ Trial mode - sending customer copy to admin');
          await sendEmail(
            ADMIN_EMAIL,
            `[FOR CUSTOMER: ${booking.email}] ✅ Booking Confirmed - ${booking.service}`,
            `<p style="background: #fef3c7; padding: 10px; border-radius: 5px; margin-bottom: 20px;">⚠️ This email was intended for customer: ${booking.email} (${booking.name})</p>${emailHtml}`,
            `[FOR: ${booking.email}]\n\n${emailText}`
          );
        }
        
        result = {
          success: true,
          message: 'Customer notified of booking confirmation',
          sms: smsResult,
          email: emailResult
        };
        break;
      }
      
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
