import { NextResponse } from 'next/server'

// Mock API endpoint for demo purposes
export async function GET() {
  return NextResponse.json({
    message: 'Mock API is working',
    sites: [
      { id: 1, name: 'Demo Site', url: 'demo.example.com' }
    ],
    users: [
      { id: 1, name: 'John Doe', role: 'Developer', bio: 'Software Developer with 5 years of experience' }
    ]
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Mock data updated successfully'
  })
}