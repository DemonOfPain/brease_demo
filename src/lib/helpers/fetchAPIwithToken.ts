import { JWT } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export type BreaseAPIResponse = {
  data: any
  cached: boolean | null
  message: string
  statusCode: number
  ok: boolean
}

export const fetchAPIwithToken = async (
  token: JWT | null,
  route: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
  body?: BodyInit | FormData | URLSearchParams | undefined | null,
  options?: {
    statusOK?: number
    customUrlPrefix?: string
  }
) => {
  if (token) {
    try {
      const headers: HeadersInit = {
        Accept: 'application/json',
        Authorization: `Bearer ${token.accessToken}`
      }
      if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }
      if (body instanceof URLSearchParams) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded;'
      }
      const fetchAPI = await fetch(
        options?.customUrlPrefix ? options?.customUrlPrefix + route : process.env.API_URL + route,
        {
          method: method,
          headers: headers,
          body: body
        }
      )
      const res = await fetchAPI.json()
      const status = fetchAPI.status
      const formatedResponse = {
        data: res.data || null,
        cached: null,
        message: res.message,
        statusCode: status,
        ok: options?.statusOK ? status === options?.statusOK : /^2\d{2}$/.test(status.toString())
      } as BreaseAPIResponse
      return NextResponse.json(formatedResponse)
    } catch (error) {
      throw error
    }
  } else {
    throw new Error('Invalid token')
  }
}
