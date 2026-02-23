import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        // Prevent clickjacking
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        // Prevent MIME type sniffing
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // XSS protection
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        // Referrer policy
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        // DNS prefetch control
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        // HSTS (force HTTPS)
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        // Permissions Policy
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        // Content Security Policy
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://www.emailjs.com",
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
            "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.emailjs.com",
            "frame-src 'none'",
          ].join('; '),
        },
      ],
    },
    {
      source: '/api/:path*',
      headers: [
        // Additional CORS headers for API
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ],

  // Handle CORS preflight requests
  async rewrites() {
    return [];
  },
};

export default nextConfig;
