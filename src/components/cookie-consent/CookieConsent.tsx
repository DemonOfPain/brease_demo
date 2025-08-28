'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../shadcn/ui/card'
import { CookieConsentButtons } from './CookieConsentButtons'
import { getCookieConsent } from '@/lib/helpers/cookies'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = getCookieConsent()
    setIsVisible(consent === null)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -420 }}
          animate={{ x: 0 }}
          exit={{ x: -420 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-[99999999999] max-w-[420px] md:left-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-t-lg">🍪 Cookie Notice</CardTitle>
              <CardDescription>
                We use cookies to enhance your browsing experience and analyze our traffic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-t-sm text-brease-gray-8">
                  Choose how you want to allow cookies:
                </p>

                {showDetails && (
                  <div className="flex flex-col gap-2 text-t-sm">
                    <div className="rounded-md border border-brease-gray-4 p-3">
                      <h4 className="font-medium text-brease-gray-10">Essential Cookies</h4>
                      <p className="text-brease-gray-8">
                        Required for basic app functionality like authentication and session
                        management.
                      </p>
                    </div>

                    <div className="rounded-md border border-brease-gray-4 p-3">
                      <h4 className="font-medium text-brease-gray-10">Analytics Cookies</h4>
                      <p className="text-brease-gray-8">
                        Help us understand how you use our app to improve your experience.
                      </p>
                    </div>

                    <div className="rounded-md border border-brease-gray-4 p-3">
                      <h4 className="font-medium text-brease-gray-10">Preference Cookies</h4>
                      <p className="text-brease-gray-8">
                        Remember your settings and preferences for a better experience.
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-t-sm text-brease-gray-8 hover:text-brease-gray-10 underline transition-colors"
                >
                  {showDetails ? 'Hide Details' : 'View Cookie Details'}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <CookieConsentButtons onConsent={() => setIsVisible(false)} />
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
