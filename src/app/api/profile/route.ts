import { NextResponse } from 'next/server'

// Mock profile endpoint for demo
export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'success',
    message: 'Profile fetched',
    data: {
      user: {
        uuid: 'user-001',
        email: 'demo@brease.com',
        firstName: 'Demo',
        lastName: 'User',
        avatar: null,
        has2fa: false,
        theme: 'light',
        currentTeam: {
          uuid: 'team-001',
          name: 'Demo Team',
          image: null,
          userRole: 'administrator'
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
    }
  })
}

export async function PUT() {
  return NextResponse.json({
    ok: true,
    status: 'success',
    message: 'Profile updated successfully',
    data: {}
  })
}
