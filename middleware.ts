import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// DEMO MODE: Bypass auth for demo
export function middleware(request: NextRequest) {
  // Allow all routes for demo
  return NextResponse.next()
}

// Only run on protected routes (but we're bypassing for demo)
export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*']
}