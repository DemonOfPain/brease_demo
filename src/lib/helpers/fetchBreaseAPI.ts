/* eslint-disable no-unused-vars */
import { toast } from '@/components/shadcn/ui/use-toast'
import { BreaseAPIResponse } from './fetchAPIwithToken'
import { signOut } from 'next-auth/react'
import { useUserStore } from '../hooks/useUserStore'
import { useAssistantStore } from '../hooks/useAssistantStore'

export interface FetchBreaseAPIOptions {
  throwOnError?: boolean
  silentError?: boolean
  showSuccessToast?: boolean
  onError?: (data: BreaseAPIResponse) => void
}

export const fetchBreaseAPI = async <T>(
  fetchFn: () => Promise<Response>,
  onSuccess: (data: BreaseAPIResponse) => void,
  options?: FetchBreaseAPIOptions
) => {
  try {
    const res = await fetchFn()
    const data = (await res.json()) as BreaseAPIResponse & T
    console.log(data)
    if (data.ok) {
      onSuccess(data)
    } else if (options?.onError) {
      // 401 = Unauthenticated / either version relase, tokens purge, BE messed up
      if (data.statusCode === 401) {
        useUserStore.persist.clearStorage()
        await signOut()
      }
      options.onError(data)
    } else {
      console.error(data)
      if (data.statusCode === 401) {
        useUserStore.persist.clearStorage()
        useAssistantStore.persist.clearStorage()
        await signOut()
      }

      // Throw error if throwOnError is enabled, otherwise show toast
      if (options?.throwOnError) {
        throw new Error(data.message || 'API request failed')
      } else if (!options?.silentError) {
        toast({ variant: 'error', title: data.message })
      }
    }
  } catch (error) {
    console.error(error)

    // Throw error if throwOnError is enabled, otherwise show toast
    if (options?.throwOnError) {
      throw error
    } else if (!options?.silentError) {
      toast({ variant: 'error', title: 'Server Error!' })
    }
  }
}
