'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/shadcn/ui/form'
import { FormInput } from '@/components/generic/form/FormInput'
import { LoaderCircleIcon, X } from 'lucide-react'
import { Text } from '@/components/generic/Text'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { useStore } from 'zustand'

const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})

export const TeamsInviteDialog = () => {
  const userStore = useStore(useUserStore)
  const loading = useUserStore((state) => state.loading)
  const [emails, setEmails] = useState<string[]>([])

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  })

  const addEmail = (data: z.infer<typeof emailSchema>) => {
    setEmails([...emails, data.email])
    form.reset()
  }

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      form.handleSubmit(addEmail)()
    }
  }

  const onSubmit = async () => {
    userStore.setLoading(true)
    userStore.inviteTeamMembers(emails)
    userStore.setLoading(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-fit">
        <ButtonPlaceholder variant="black" label="Invite Team Member" icon="Plus" size="md" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invite Team Members</AlertDialogTitle>
          <AlertDialogDescription className="!text-brease-gray-9 !-mb-2">
            {` Enter an email address to invite team member.`}
          </AlertDialogDescription>
          <AlertDialogDescription className="!text-brease-gray-7 text-t-xxs">
            {`(You can add multiple by pressing 'Enter' after an email address is typed)`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <FormInput
              form={form}
              fieldName="email"
              placeholder="Enter email address"
              type="email"
              required
              onKeyDown={handleKeyDown}
            />
            <div className="flex flex-wrap gap-2">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="bg-brease-primary px-3 py-1 shadow-brease-xs rounded-full flex items-center group"
                >
                  <Text size="xs" style="regular" className="text-white">
                    {email}
                  </Text>
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="stroke-white" />
                  </button>
                </div>
              ))}
            </div>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {loading ? (
            <ButtonPlaceholder variant="primary" size="md">
              <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
            </ButtonPlaceholder>
          ) : (
            <AlertDialogAction disabled={emails.length > 0 ? false : true} onClick={onSubmit}>
              Send Invite
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
