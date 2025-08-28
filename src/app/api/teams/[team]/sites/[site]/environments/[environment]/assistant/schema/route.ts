import { fetchAPIwithToken, BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  let breaseResponse: BreaseAPIResponse = {
    data: null,
    cached: null,
    message: '',
    statusCode: 500,
    ok: false
  }

  try {
    const token = await getToken({ req })
    if (!token) {
      breaseResponse.message = 'Unauthorized'
      breaseResponse.statusCode = 401
      return NextResponse.json(breaseResponse, { status: 401 })
    }

    const teamId = params.team
    const siteId = params.site
    const envId = params.environment
    const requestBody = await req.json()
    const { target, operation, targetId, targetName } = requestBody
    const queryParams = new URLSearchParams({
      target: target,
      operation: operation,
      targetUuid: targetId,
      targetName: targetName
    })
    const BESchemaResponse = await fetchAPIwithToken(
      token,
      `/teams/${teamId}/sites/${siteId}/environments/${envId}/prompt/operation?${queryParams.toString()}`,
      'POST'
    )

    const BESchema = await BESchemaResponse.json()
    console.log('Schema API Response:', BESchema)

    if (!BESchema.ok) {
      breaseResponse.message = `Failed to get schema: ${BESchema.message}`
      breaseResponse.statusCode = BESchema.statusCode || 500
      return NextResponse.json(breaseResponse, { status: breaseResponse.statusCode })
    }

    breaseResponse.data = BESchema.data
    breaseResponse.message = 'Success'
    breaseResponse.statusCode = 200
    breaseResponse.ok = true
    return NextResponse.json(breaseResponse, { status: 200 })
  } catch (error: any) {
    console.error('Route error:', error)
    breaseResponse.message = error?.message || 'Internal server error'
    breaseResponse.statusCode = 500
    breaseResponse.ok = false
    return NextResponse.json(breaseResponse, { status: 500 })
  }
}
