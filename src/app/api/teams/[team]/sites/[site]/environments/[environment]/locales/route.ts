import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

// GET list all locals of site
export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/locales`,
    'GET'
  )
  return apiResponse
}

// POST add local to site
export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const localeData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/add-locale`,
    'POST',
    localeData
  )
  return apiResponse
}

// PUT change status of locale
export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const localeData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/update-locale`,
    'POST',
    localeData
  )
  return apiResponse
}

// DELETE remove locale from site
export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const localeData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/remove-locale`,
    'POST',
    localeData
  )
  return apiResponse
}
