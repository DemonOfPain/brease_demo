import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// DOWNLOAD media
export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; media: string } }
) {
  const token = await getToken({ req })

  if (!token?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/teams/${params.team}/sites/${params.site}/environments/${params.environment}/media/${params.media}/download`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      }
    )
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }
    const fileBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition')
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition || 'attachment'
      }
    })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to download file' }, { status: 500 })
  }
}
