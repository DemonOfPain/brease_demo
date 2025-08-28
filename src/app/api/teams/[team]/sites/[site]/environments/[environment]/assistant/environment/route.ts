import { fetchAPIwithToken, BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'

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
    const promptDataForm = await req.formData()
    let cacheHit = true
    const getCachedEnvironmentData = unstable_cache(
      async () => {
        cacheHit = false
        const BEEnvironmentResponse = await fetchAPIwithToken(
          token,
          `/teams/${teamId}/sites/${siteId}/environments/${envId}/prompt/system`,
          'POST',
          promptDataForm
        )
        const BEEnvironmentData = await BEEnvironmentResponse.json()
        console.log('Environment API Response:', BEEnvironmentData)
        return {
          data: BEEnvironmentData,
          shouldCache: BEEnvironmentData.ok
        }
      },
      [`${token.accessToken}-assistant-environment-${teamId}-${siteId}-${envId}`],
      { tags: ['assistant-environment'] }
    )

    const { data: BEEnvironmentData, shouldCache } = await getCachedEnvironmentData()

    if (!shouldCache) {
      // Force cache miss on next request with this key
      unstable_cache(
        async () => null,
        [`${token.accessToken}-assistant-environment-${teamId}-${siteId}-${envId}`],
        {
          revalidate: false,
          tags: ['assistant-environment']
        }
      )()
    }

    if (!BEEnvironmentData.ok) {
      breaseResponse.message = `Failed to get environment data: ${BEEnvironmentData.message}`
      breaseResponse.statusCode = BEEnvironmentData.statusCode || 500
      return NextResponse.json(breaseResponse, { status: breaseResponse.statusCode })
    }

    breaseResponse.data = BEEnvironmentData.data
    breaseResponse.cached = shouldCache && cacheHit
    breaseResponse.message = 'Success'
    breaseResponse.statusCode = 200
    breaseResponse.ok = true
    return NextResponse.json(breaseResponse, { status: 200 })
  } catch (error: any) {
    console.error('❌ Environment data route error:', error)
    breaseResponse.message = error?.message || 'Internal server error'
    breaseResponse.statusCode = 500
    breaseResponse.ok = false
    return NextResponse.json(breaseResponse, { status: 500 })
  }
}
