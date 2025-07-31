import { withAuth } from 'next-auth/middleware';
import { NextResponse, NextRequest } from 'next/server';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const publicApiRoutes = [
  '/api/health',
  '/api/projects',
  '/api/blogs',
  '/api/assessments',
];

function isPublicApiRoute(pathname: string): boolean {
  return publicApiRoutes.some(route => pathname.startsWith(route));
}

function isAllowedOrigin(origin: string): boolean {
  return allowedOrigins.includes(origin);
}

function isFromFrontend(req: NextRequest): boolean {
  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';
  const userAgent = req.headers.get('user-agent') || '';
  

  if (origin && isAllowedOrigin(origin)) {
    return true;
  }
  
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return isAllowedOrigin(refererOrigin);
    } catch {
      console.error('Invalid referer URL:', referer);
      return false;
    }
  }

  if (userAgent.includes('node') || 
      userAgent.includes('undici') || 
      userAgent.includes('fetch') ||
      userAgent === '') {
    return true; 
  }
  
  return false;
}

function isFromDashboard(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  const host = req.headers.get('host') || '';
  
  if (referer.includes(host) && referer.includes('/dashboard')) {
    return true;
  }
 
  const origin = req.headers.get('origin') || '';
  if (!origin && host) {
    return true; 
  }
  
  return false;
}

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.pathname;
    const origin = req.headers.get('origin') || '';
    const response = NextResponse.next();

    // CORS
    if (url.startsWith('/api/')) {
      if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Vary', 'Origin');
      }

      if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 204,
          headers: response.headers,
        });
      }
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
      
        if (pathname.startsWith('/api/') && 
            isPublicApiRoute(pathname) && 
            isFromFrontend(req)) {
          return true;
        }
        
        
        if (pathname.startsWith('/api/') && 
            isPublicApiRoute(pathname) && 
            isFromDashboard(req)) {
         
          return !!token;
        }
        
        
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
        
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};