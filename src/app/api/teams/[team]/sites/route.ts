import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// GET team sites
export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  
  // DEMO MODE: Return mock sites if no token
  if (!token) {
    return NextResponse.json({
      ok: true,
      status: 'success',
      message: 'Sites fetched',
      data: {
        sites: [
          {
            uuid: 'site-001',
            name: 'Corporate Website',
            slug: 'corporate-website',
            domain: 'www.example-corp.com',
            status: 'published',
            description: 'Main corporate website with company information',
            favicon: null,
            logo: null,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date().toISOString(),
            environments: [
              { 
                uuid: 'env-001',
                name: 'Production',
                slug: 'production',
                url: 'www.example-corp.com',
                isProduction: true
              },
              { 
                uuid: 'env-002',
                name: 'Staging',
                slug: 'staging', 
                url: 'staging.example-corp.com',
                isProduction: false
              }
            ],
            users: [
              {
                uuid: 'user-001',
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@brease.com'
              }
            ]
          },
          {
            uuid: 'site-002',
            name: 'Blog Platform',
            slug: 'blog-platform',
            domain: 'blog.example.com',
            status: 'published',
            description: 'Company blog and news platform',
            favicon: null,
            logo: null,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date().toISOString(),
            environments: [
              { 
                uuid: 'env-003',
                name: 'Production',
                slug: 'production',
                url: 'blog.example.com',
                isProduction: true
              }
            ],
            users: [
              {
                uuid: 'user-001',
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@brease.com'
              }
            ]
          },
          {
            uuid: 'site-003',
            name: 'E-Commerce Store',
            slug: 'ecommerce-store',
            domain: 'shop.example.com',
            status: 'draft',
            description: 'Online store (under development)',
            favicon: null,
            logo: null,
            createdAt: new Date('2024-03-01').toISOString(),
            updatedAt: new Date().toISOString(),
            environments: [
              { 
                uuid: 'env-004',
                name: 'Development',
                slug: 'development',
                url: 'dev.shop.example.com',
                isProduction: false
              }
            ],
            users: []
          }
        ]
      },
      cached: false
    })
  }
  
  // Original token-based logic would go here
  throw Error('Token required for real API')
}
