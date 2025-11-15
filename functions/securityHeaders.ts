import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  
  // HSTS (if using HTTPS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // CORS
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

function getSecurityHeaders(path) {
  const headers = { ...SECURITY_HEADERS };
  
  // Adjust CSP for specific routes
  if (path.startsWith('/api/')) {
    // API routes can have stricter CSP
    headers['Content-Security-Policy'] = "default-src 'none'; frame-ancestors 'none'";
  }
  
  return headers;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const headers = getSecurityHeaders(url.pathname);
    
    // Check if it's an OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': headers['Access-Control-Allow-Origin'],
          'Access-Control-Allow-Methods': headers['Access-Control-Allow-Methods'],
          'Access-Control-Allow-Headers': headers['Access-Control-Allow-Headers'],
          'Access-Control-Max-Age': headers['Access-Control-Max-Age']
        }
      });
    }
    
    return Response.json({
      success: true,
      headers: Object.keys(headers),
      message: 'Security headers configured'
    }, {
      headers
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});