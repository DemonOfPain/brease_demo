'use client'
import React, { useEffect } from 'react'
import { Text } from '@/components/generic/Text'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { useRouter } from 'next/navigation'
import { useStore } from 'zustand'
import { LoaderCircleIcon } from 'lucide-react'
import { Session } from 'next-auth'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'

export const VerifyEmailOverlay = ({
  code,
  session
}: {
  code: string
  session: Session | null
}) => {
  const router = useRouter()
  const userStore = useStore(useUserStore)

  useEffect(() => {
    const verify = async () => {
      let formData = new FormData()
      appendDataToFormData({ code: code }, formData, 'POST')
      setTimeout(async () => {
        userStore.verifyEmail(formData)
        if (session) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      }, 1000)
    }
    verify()
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-brease-gray-10/20 backdrop-blur-xl">
      <div className="fixed left-[50%] top-[50%] z-[9999] flex flex-col justify-center items-center w-full max-w-lg rounded-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg">
        <Text size="md" style="regular">
          Verifying your email...
        </Text>
        <LoaderCircleIcon className="h-10 w-10 stroke-brease-primary animate-spin" />
      </div>
    </div>
  )
}
