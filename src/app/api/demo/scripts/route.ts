import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function POST(request: Request) {
  const { siteId, script } = await request.json()
  
  const added = mockData.addScript(siteId, script)
  
  if (added) {
    return NextResponse.json({
      ok: true,
      message: 'Script added successfully'
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Site not found'
  }, { status: 404 })
}