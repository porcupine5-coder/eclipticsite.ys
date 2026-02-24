import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
  blockDuration: 300,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 100,
  email: 254,
  packageType: 120,
  budget: 100,
  requirements: 5000,
  attachmentName: 255,
};

function sanitizeInput(input) {
  if (!input) return '';
  const str = String(input).trim();
  if (str.length > 10000) return '';
  return str.replace(/[<>"'&]/g, (char) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;',
    };
    return entities[char];
  });
}

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return '127.0.0.1';
}

function formatTimeline(isoValue) {
  if (!isoValue) return 'Not specified';
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return 'Not specified';
  return date.toISOString().slice(0, 10);
}

export async function POST(request) {
  const clientIP = getClientIP(request);

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
        },
      }
    );
  }

  try {
    const body = await request.json();

    const name = sanitizeInput(body?.name);
    const email = sanitizeInput(body?.email);
    const packageType = sanitizeInput(body?.packageType);
    const budget = sanitizeInput(body?.budget);
    const requirements = sanitizeInput(body?.requirements);
    const attachmentName = sanitizeInput(body?.attachmentName);
    const timeline = formatTimeline(body?.timeline);

    if (name.length > MAX_LENGTHS.name) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 });
    }
    if (email.length > MAX_LENGTHS.email) {
      return NextResponse.json({ error: 'Email is too long.' }, { status: 400 });
    }
    if (packageType.length > MAX_LENGTHS.packageType) {
      return NextResponse.json({ error: 'Package type is too long.' }, { status: 400 });
    }
    if (budget.length > MAX_LENGTHS.budget) {
      return NextResponse.json({ error: 'Budget is too long.' }, { status: 400 });
    }
    if (requirements.length > MAX_LENGTHS.requirements) {
      return NextResponse.json({ error: 'Requirements are too long.' }, { status: 400 });
    }
    if (attachmentName.length > MAX_LENGTHS.attachmentName) {
      return NextResponse.json({ error: 'Attachment name is too long.' }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }
    if (packageType.length < 2) {
      return NextResponse.json({ error: 'Package type is required.' }, { status: 400 });
    }
    if (!budget) {
      return NextResponse.json({ error: 'Budget is required.' }, { status: 400 });
    }
    if (requirements.length < 5) {
      return NextResponse.json({ error: 'Requirements must be at least 5 characters.' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || gmailUser;

    if (!gmailUser || !gmailAppPassword || !recipient) {
      console.error('Quote email configuration missing');
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
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${gmailUser}>`,
      replyTo: email,
      to: recipient,
      subject: `[Quote Request] ${packageType}`,
      text: `You received a new quote request.

Name: ${name}
Email: ${email}
Package: ${packageType}
Budget: ${budget}
Timeline: ${timeline}
Attachment Name: ${attachmentName || 'None'}

Requirements:
${requirements}
`,
      html: `
        <p>You received a new quote request.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Package:</strong> ${packageType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Attachment Name:</strong> ${attachmentName || 'None'}</p>
        <p><strong>Requirements:</strong></p>
        <p>${requirements.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Quote email send failed:', error?.message || error);
    const errorText = String(error?.message || '');
    const isAuthError =
      error?.code === 'EAUTH' ||
      /invalid login|username and password not accepted|application-specific password|bad credentials/i.test(errorText);

    if (isAuthError) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Failed to send quote request. Please try again later.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
