import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function GET() {
  const navigation = mockData.getNavigation()
  
  return NextResponse.json({
    ok: true,
    data: {
      navigation
    }
  })
}

export async function POST(request: Request) {
  const newItem = await request.json()
  
  const item = mockData.addNavItem(newItem)
  
  return NextResponse.json({
    ok: true,
    data: {
      item
    }
  })
}

export async function PATCH(request: Request) {
  const { id, updates } = await request.json()
  
  const item = mockData.updateNavItem(id, updates)
  
  if (item) {
    return NextResponse.json({
      ok: true,
      data: {
        item
      }
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Navigation item not found'
  }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  
  const removed = mockData.removeNavItem(id)
  
  if (removed) {
    return NextResponse.json({
      ok: true,
      message: 'Navigation item removed successfully'
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Navigation item not found'
  }, { status: 404 })
}