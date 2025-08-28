import { NextResponse } from 'next/server'

// Mock team members data
let teamMembers = [
  {
    id: 'member-001',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software Developer with 5 years of experience',
    role: 'Developer',
    avatar: null,
    path: '/team/john-doe'
  },
  {
    id: 'member-002',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    bio: 'UX Designer focused on user-centered design',
    role: 'Designer',
    avatar: null,
    path: '/team/jane-smith'
  },
  {
    id: 'member-003',
    firstName: 'Mike',
    lastName: 'Johnson',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    bio: 'Project Manager with expertise in agile methodologies',
    role: 'Project Manager',
    avatar: null,
    path: '/team/mike-johnson'
  }
]

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: {
      members: teamMembers
    }
  })
}

export async function PATCH(request: Request) {
  const { id, updates } = await request.json()
  
  const memberIndex = teamMembers.findIndex(m => m.id === id)
  if (memberIndex !== -1) {
    teamMembers[memberIndex] = {
      ...teamMembers[memberIndex],
      ...updates
    }
    
    return NextResponse.json({
      ok: true,
      data: {
        member: teamMembers[memberIndex]
      }
    })
  }
  
  return NextResponse.json({
    ok: false,
    error: 'Member not found'
  }, { status: 404 })
}