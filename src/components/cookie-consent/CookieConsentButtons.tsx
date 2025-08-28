'use client'

import { useToast } from '@/components/shadcn/ui/use-toast'
import { setCookieConsent, CookieConsentType } from '@/lib/helpers/cookies'
import Button from '../generic/Button'

interface CookieConsentButtonsProps {
  onConsent: () => void
}

export function CookieConsentButtons({ onConsent }: CookieConsentButtonsProps) {
  const { toast } = useToast()

  const handleConsent = (type: CookieConsentType) => {
    if (type === 'none') {
      toast({
        title: 'Limited Functionality',
        description: 'Some features will not work without essential cookies.',
        variant: 'warning'
      })
    }

    setCookieConsent(type)
    toast({
      title: 'Preferences saved',
      description: 'Your cookie preferences have been saved.',
      variant: 'success'
    })
    onConsent()
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Button
        variant="primary"
        size="sm"
        className="w-full justify-center"
        onClick={() => handleConsent('all')}
      >
        Accept All Cookies
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="w-full justify-center"
        onClick={() => handleConsent('essential')}
      >
        Accept Essential Cookies Only
      </Button>
      <Button
        variant="textType"
        size="sm"
        className="w-full justify-center hover:text-brease-error"
        onClick={() => handleConsent('none')}
      >
        Decline All Cookies
      </Button>
    </div>
  )
}
