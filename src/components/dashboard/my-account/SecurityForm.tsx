'use client'
import React from 'react'
import { Title } from '@/components/generic/Title'
import { FormLayoutRow } from '@/components/generic/form/FormLayoutRow'
import Button from '@/components/generic/Button'
import { Switch } from '@/components/shadcn/ui/switch'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { TwoFAEnableForm } from './TwoFAEnableForm'
import { TwoFADisableForm } from './TwoFADisableForm'
import { UserProfileDetail } from '@/interface/user'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'
import { useUserStore } from '@/lib/hooks/useUserStore'

export const SecurityForm = ({ user }: { user: UserProfileDetail }) => {
  const { loading, setLoading, requestPasswordChange } = useUserStore()

  const handlePasswordChange = async () => {
    setLoading(true)
    await requestPasswordChange()
    setLoading(false)
  }

  return (
    <div className="w-full flex flex-col items-start">
      <div className="w-full flex flex-row items-start justify-between gap-4 flex-wrap pb-6 border-b-2 border-brease-gray-4">
        <div className="w-fit flex flex-col">
          <Title size="xs" style="semibold">
            Security Configuration
          </Title>
        </div>
      </div>
      <FormLayoutRow title="Password" description="Set a new password to login to your account.">
        {loading ? (
          <ButtonPlaceholder variant="secondary" size="md" className="!w-[208.62px] justify-center">
            <LoaderCircleIcon className="h-5 w-5 stroke-brease-primary animate-spin" />
          </ButtonPlaceholder>
        ) : (
          <Button
            variant="secondary"
            size="md"
            label="Request Password Change"
            onClick={handlePasswordChange}
          />
        )}
      </FormLayoutRow>
      <FormLayoutRow
        hasSeparator={false}
        title="2-step verification"
        description="Add an additional layer of security to your account during login."
      >
        <AlertDialog>
          <VisuallyHidden>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </VisuallyHidden>
          <AlertDialogTrigger>
            <Switch checked={user!.has2fa} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            {user!.has2fa === true && (
              <>
                <TwoFADisableForm />
                <AlertDialogCancel className="w-full justify-center">Cancel</AlertDialogCancel>
              </>
            )}
            {user!.has2fa === false && (
              <>
                <TwoFAEnableForm />
                <AlertDialogCancel className="w-full justify-center">Cancel</AlertDialogCancel>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </FormLayoutRow>
    </div>
  )
}
