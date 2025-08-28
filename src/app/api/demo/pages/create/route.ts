import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Create the page with sections if it's Company Profile
    const newPage = mockData.createPage({
      name: body.name || 'Company Profile',
      slug: body.slug || 'company-profile',
      path: body.path || '/company-profile',
      title: body.title || 'Company Profile',
      metaDescription: body.metaDescription || 'Learn about our company',
      siteId: body.siteId || 'site-001'
    })
    
    return NextResponse.json({
      ok: true,
      data: {
        page: newPage,
        sectionsCount: newPage.sections ? newPage.sections.length : 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Failed to create page' },
      { status: 500 }
    )
  }
}