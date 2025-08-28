'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/ui/tabs'
import { PriceCard } from '@/components/dashboard/pricing/PriceCard'
import { PriceCardList, PriceCardListItem } from '@/components/dashboard/pricing/PriceCard'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { useStore } from 'zustand'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from '@/components/shadcn/ui/use-toast'
//import Button from '@/components/generic/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
  //  AlertDialogTrigger,
} from '@/components/shadcn/ui/alert-dialog'

export default function PricingPage() {
  const userStore = useStore(useUserStore)
  const plans = useUserStore((state) => state.subscriptionPlans)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  //const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)

  useEffect(() => {
    const checkout = searchParams?.get('checkout')
    if (checkout === 'success') {
      toast({ variant: 'success', title: 'Subscription updated successfully!' })
      router.replace('/dashboard/pricing')
    } else if (checkout === 'cancelled') {
      toast({ variant: 'default', title: 'Checkout was cancelled' })
      router.replace('/dashboard/pricing')
    }
  }, [searchParams, router])

  const organizedPlans = useMemo(() => {
    const organized = {
      monthly: {} as { [key: string]: any },
      yearly: {} as { [key: string]: any }
    }
    plans.forEach((plan) => {
      const planKey = plan.shortName.toLowerCase()
      if (
        plan.code.includes('monthly') ||
        (!plan.code.includes('yearly') && !plan.code.includes('monthly'))
      ) {
        organized.monthly[planKey] = plan
      }
      if (
        plan.code.includes('yearly') ||
        (!plan.code.includes('yearly') && !plan.code.includes('monthly'))
      ) {
        organized.yearly[planKey] = plan
      }
    })
    return organized
  }, [plans])

  const handlePlanSelection = async (planType: 'free' | 'scale' | 'pro') => {
    if (planType === 'free') {
      const { subscription } = userStore.userTeam
      if (subscription?.priceId && !subscription.cancelAtPeriodEnd) {
        setShowDowngradeDialog(true)
        return
      }
      return
    }
    if (planType === 'pro') {
      window.open(
        `mailto:hello@designatives.com?subject=Brease Pro Plan Inquiry - ${userStore.user.currentTeam.name}`,
        '_blank'
      )
      return
    }
    const selectedPlan = organizedPlans[billingPeriod][planType]
    if (!selectedPlan?.stripePriceId) {
      toast({ variant: 'error', title: 'Price not found' })
      return
    }
    try {
      await userStore.handleCheckout(selectedPlan.stripePriceId)
    } catch (error) {
      console.error('Checkout error:', error)
      toast({ variant: 'error', title: 'Checkout failed' })
    }
  }

  //  const handleCancelSubscription = async () => {
  //    setShowCancelDialog(false)
  //    await userStore.cancelSubscription()
  //  }

  const handleDowngradeToFree = async () => {
    setShowDowngradeDialog(false)
    await userStore.cancelSubscription()
  }

  const currentPlan = userStore.userTeam.subscription?.name?.toLowerCase() || 'free'
  const { loading } = userStore
  //const { subscription } = userStore.userTeam

  const getCurrentPlan = (planType: string) => {
    return organizedPlans[billingPeriod][planType]
  }

  const getDisplayPrice = (planType: string) => {
    const plan = getCurrentPlan(planType)
    if (!plan) return '0€'
    if (plan.formattedPrice === 'free') return '0€'
    if (plan.formattedPrice === 'custom') return 'Custom'

    return `${plan.price || 0}€`
  }

  const getPriceTime = (planType: string) => {
    const plan = getCurrentPlan(planType)
    if (!plan) return '/month'

    if (plan.formattedPrice === 'free' || plan.formattedPrice === 'custom') return ''

    return billingPeriod === 'yearly' ? '/year' : '/month'
  }

  return (
    <div className="w-full h-fit flex flex-col items-center gap-4 pb-20">
      <Tabs
        defaultValue="monthly"
        value={billingPeriod}
        onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
        className="w-full flex flex-col items-center mt-2"
      >
        <TabsList className="h-10">
          <TabsTrigger value="monthly" className="h-10">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="h-10">
            Yearly
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value={billingPeriod}
          className="w-full flex flex-row justify-center items-center gap-2 flex-wrap"
        >
          <PriceCard
            id="free"
            selected={currentPlan === 'free'}
            title="Free"
            price="0€"
            priceTime="/month"
            description="Perfect for getting started"
            buttonOnClick={() => handlePlanSelection('free')}
          >
            <PriceCardList>
              <PriceCardListItem checked={true} description="1 Site" />
              <PriceCardListItem checked={true} description="Basic Editor" />
              <PriceCardListItem checked={true} description="Community Support" />
              <PriceCardListItem checked={false} description="Advanced Features" />
              <PriceCardListItem checked={false} description="Priority Support" />
            </PriceCardList>
          </PriceCard>

          <PriceCard
            id="scale"
            selected={currentPlan === 'scale'}
            title="Scale"
            price={getDisplayPrice('scale')}
            priceTime={getPriceTime('scale')}
            description="For growing teams and businesses"
            buttonOnClick={() => handlePlanSelection('scale')}
          >
            <PriceCardList>
              <PriceCardListItem checked={true} description="Unlimited Sites" />
              <PriceCardListItem checked={true} description="Full Editor Suite" />
              <PriceCardListItem checked={true} description="Brease AI" />
              <PriceCardListItem checked={true} description="Team Collaboration" />
              <PriceCardListItem checked={true} description="Priority Support" />
              <PriceCardListItem checked={true} description="Advanced Analytics" />
            </PriceCardList>
          </PriceCard>

          <PriceCard
            id="pro"
            selected={currentPlan === 'pro'}
            title="Pro"
            price={getDisplayPrice('pro')}
            priceTime={getPriceTime('pro')}
            description="For enterprises with custom needs"
            buttonOnClick={() => handlePlanSelection('pro')}
          >
            <PriceCardList>
              <PriceCardListItem checked={true} description="Everything in Scale" />
              <PriceCardListItem checked={true} description="Custom Integrations" />
              <PriceCardListItem checked={true} description="White Label Solution" />
              <PriceCardListItem checked={true} description="Dedicated Support" />
              <PriceCardListItem checked={true} description="SLA Guarantee" />
              <PriceCardListItem checked={true} description="Custom Training" />
            </PriceCardList>
          </PriceCard>
        </TabsContent>
      </Tabs>

      {/* Downgrade to Free Dialog */}
      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Downgrade to Free</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your current subscription at the end of the billing period and
              downgrade you to the Free plan. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Current Plan</AlertDialogCancel>
            <AlertDialogAction onClick={handleDowngradeToFree} disabled={loading}>
              Downgrade to Free
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
