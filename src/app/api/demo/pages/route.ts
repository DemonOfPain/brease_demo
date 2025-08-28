import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('siteId')
  
  const pages = mockData.getPages(siteId || undefined)
  
  return NextResponse.json({
    ok: true,
    data: {
      pages
    }
  })
}

export async function POST(request: Request) {
  const newPage = await request.json()
  
  const page = mockData.createPage(newPage)
  
  return NextResponse.json({
    ok: true,
    data: {
      page
    }
  })
}

export async function PATCH(request: Request) {
  const { id, updates } = await request.json()
  
  const page = mockData.updatePage(id, updates)
  
  if (page) {
    return NextResponse.json({
      ok: true,
      data: {
        page
      }
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Page not found'
  }, { status: 404 })
}