import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// Mock login endpoint for demo
export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const email = url.searchParams.get('email')
  const password = url.searchParams.get('password')
  
  // Check demo credentials
  if (email === 'demo@brease.com' && password === 'demo123') {
    return NextResponse.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token-for-demo-' + Date.now(),
        user: {
          uuid: 'user-001',
          email: 'demo@brease.com',
          name: 'Demo User',
          email_verified_at: new Date().toISOString(),
          two_fa_verified_at: null,
          profile: {
            uuid: 'profile-001',
            first_name: 'Demo',
            last_name: 'User',
            avatar: null,
            country: 'US',
            language: 'en'
          }
        },
        teams: [
          {
            uuid: 'team-001',
            name: 'Demo Team',
            slug: 'demo-team',
            logo: null,
            pivot: {
              role: 'owner'
            }
          }
        ]
      }
    }, { status: 200 })
  }
  
  // Return error for invalid credentials
  return NextResponse.json({
    status: 'error',
    message: 'Invalid credentials'
  }, { status: 401 })
}