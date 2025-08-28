import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  
  const results = mockData.searchContent(query)
  
  return NextResponse.json({
    ok: true,
    data: {
      results
    }
  })
}