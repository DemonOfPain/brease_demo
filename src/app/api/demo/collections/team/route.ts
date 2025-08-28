import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function GET() {
  const teamMembers = mockData.getTeamMembers()
  
  return NextResponse.json({
    ok: true,
    data: {
      entries: teamMembers
    }
  })
}

export async function PATCH(request: Request) {
  const { id, updates } = await request.json()
  
  const member = mockData.updateTeamMember(id, updates)
  
  if (member) {
    return NextResponse.json({
      ok: true,
      data: {
        entry: member
      }
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Team member not found'
  }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  
  const removed = mockData.removeTeamMember(id)
  
  if (removed) {
    return NextResponse.json({
      ok: true,
      message: 'Team member removed successfully'
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Team member not found'
  }, { status: 404 })
}