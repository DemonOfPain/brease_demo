import { NextResponse } from 'next/server'

// Mock team endpoint for demo
export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'success', 
    message: 'Team fetched',
    data: {
      team: {
        uuid: 'team-001',
        name: 'Demo Team',
        slug: 'demo-team',
        logo: null,
        subscription: {
          status: 'active',
          planName: 'Pro Plan',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        sites: [
          {
            uuid: 'site-001',
            name: 'Corporate Website',
            domain: 'www.example-corp.com',
            status: 'published',
            siteAvatar: null,
            users: [
              { uuid: 'user-001', firstName: 'Demo', lastName: 'User', email: 'demo@brease.com', avatar: null }
            ]
          },
          {
            uuid: 'site-002',
            name: 'Blog Platform',
            domain: 'blog.example.com',
            status: 'published',
            siteAvatar: null,
            users: [
              { uuid: 'user-001', firstName: 'Demo', lastName: 'User', email: 'demo@brease.com', avatar: null }
            ]
          },
          {
            uuid: 'site-003',
            name: 'E-Commerce Store',
            domain: 'shop.example.com',
            status: 'draft',
            siteAvatar: null,
            users: []
          }
        ],
        users: [
          {
            uuid: 'user-001',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@brease.com',
            avatar: null,
            role: 'owner'
          },
          {
            uuid: 'user-002',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            avatar: null,
            role: 'admin'
          }
        ]
      }
    }
  })
}
