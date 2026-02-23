import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory, for production use Redis or similar)
const requestMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX = 100; // Max requests per window for general routes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip rate limiting for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  // Rate limiting for non-API routes
  if (!pathname.startsWith('/api')) {
    const now = Date.now();
    const record = requestMap.get(ip);

    if (!record || now > record.resetTime) {
      requestMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW * 1000 });
    } else {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        return new NextResponse('Too many requests', {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)) },
        });
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Remove server header
  response.headers.delete('server');
  response.headers.delete('x-powered-by');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
