'use client'
import { Text } from '@/components/generic/Text'
import { IntegrationsCard } from '@/components/dashboard/sites/integrations/IntegrationsCard'
import { GoogleAnalyticsDialog } from './GoogleAnalyticsDialog'

export default function SiteIntegrationsPage() {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="w-fit flex flex-col">
        <Text size="xl" style="semibold">
          Integrations
        </Text>
        <Text size="sm" style="regular">
          Manage and configure site integrations
        </Text>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-x-4 gap-y-4">
        <IntegrationsCard
          logo={'https://upload.wikimedia.org/wikipedia/commons/8/89/Logo_Google_Analytics.svg'}
          name="Google Analytics"
          enabled
          dialog={<GoogleAnalyticsDialog />}
          onChange={{
            onEnable: function (): void {
              console.log('enable')
            },
            onDisable: function (): void {
              console.log('disable')
            }
          }}
        />
        {/* <IntegrationsCard
          logo={'https://upload.wikimedia.org/wikipedia/commons/f/f6/Disqus_logo_%28blue%29.svg'}
          name="Disqus"
          enabled={false}
        />
        <IntegrationsCard
          logo={'https://upload.wikimedia.org/wikipedia/commons/c/cd/AdSense_Logo.svg'}
          name="Google AdSense"
          enabled={false}
        />
        <IntegrationsCard
          logo={'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'}
          name="Meta Pixel"
          enabled={false}
        />
        <IntegrationsCard
          logo={'https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg'}
          name="Twilio Segment"
          enabled={false}
        />
        <IntegrationsCard
          logo={'https://upload.wikimedia.org/wikipedia/commons/e/e4/MailChimp.svg'}
          name="Mailchimp"
          enabled={false}
        /> */}
      </div>
    </div>
  )
}
