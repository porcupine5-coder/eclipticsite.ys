import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 5 requests per minute per IP
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
  blockDuration: 300, // Block for 5 minutes if exceeded
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maximum input lengths to prevent DoS
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
};

function sanitizeInput(input) {
  if (!input) return '';
  const str = String(input).trim();
  // Limit length first
  if (str.length > 10000) return '';
  return str.replace(/[<>"'&]/g, (char) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;'
    };
    return entities[char];
  });
}

function getClientIP(request) {
  // Try to get IP from headers (works behind proxies/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return '127.0.0.1'; // Fallback for local development
}

export async function POST(request) {
  const clientIP = getClientIP(request);

  // Rate limiting check
  try {
    await rateLimiter.consume(clientIP);
  } catch (rateLimiterRes) {
    const retrySecs = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(retrySecs),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  try {
    const body = await request.json();
    const name = sanitizeInput(body?.name);
    const email = sanitizeInput(body?.email);
    const subject = sanitizeInput(body?.subject);
    const message = sanitizeInput(body?.message);

    // Validate input lengths
    if (name.length > MAX_LENGTHS.name) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 });
    }
    if (email.length > MAX_LENGTHS.email) {
      return NextResponse.json({ error: 'Email is too long.' }, { status: 400 });
    }
    if (subject.length > MAX_LENGTHS.subject) {
      return NextResponse.json({ error: 'Subject is too long.' }, { status: 400 });
    }
    if (message.length > MAX_LENGTHS.message) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }

    // Validate required fields
    if (name.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }
    if (subject.length < 2) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const contactRecipient = process.env.CONTACT_RECIPIENT_EMAIL || gmailUser;

    if (!gmailUser || !gmailAppPassword || !contactRecipient) {
      console.error('Email configuration missing');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    if (gmailAppPassword.length !== 16) {
      console.error('Invalid app password length');
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${gmailUser}>`,
      replyTo: email,
      to: contactRecipient,
      subject: `[Contact Form] ${subject}`,
      text: `You received a new contact form message.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
`,
      html: `
        <p>You received a new contact form message.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Contact email send failed:', error?.message || error);
    const errorText = String(error?.message || '');
    const isAuthError =
      error?.code === 'EAUTH' ||
      /invalid login|username and password not accepted|application-specific password|bad credentials/i.test(errorText);

    if (isAuthError) {
      console.error('Gmail auth error');
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Failed to send contact email. Please try again later.' }, { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
