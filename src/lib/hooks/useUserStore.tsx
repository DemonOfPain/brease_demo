import { UserProfileDetail, UserStore } from '@/interface/user'
import { create } from 'zustand'
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware'
import { BreaseAPIResponse } from '../helpers/fetchAPIwithToken'
import { fetchBreaseAPI } from '../helpers/fetchBreaseAPI'
import { toast } from '@/components/shadcn/ui/use-toast'
import { Team, TeamSubscription } from '@/interface/team'
import { useSiteStore } from './useSiteStore'
import { useMediaStore } from './useMediaStore'
import { SiteDetail, SiteEnvironment } from '@/interface/site'
import { useEditorStore } from './useEditorStore'
import { useManagerStore } from './useManagerStore'

export const useUserStore = create<UserStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        loading: false,
        user: {} as UserProfileDetail,
        userTeam: {} as Team,
        subscriptionPlans: [],
        setLoading: (isLoading: boolean) => set({ loading: isLoading }),

        getUser: async () => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch('/api/profile', { method: 'GET' }),
            (res) => {
              set({ user: res.data.user })
              useSiteStore.getState().getAllLocales()
              useEditorStore.getState().getElements()
              get().getUserTeamDetail(res.data.user.currentTeam.uuid)
            }
          )
        },

        updateUserProfile: async (data: any) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch('/api/profile', { method: 'PUT', body: data }),
            (res) => {
              get().getUser()
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        getUserTeamDetail: async (teamId: string) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch(`/api/teams/${teamId}`, { method: 'GET' }),
            (res) => {
              set({ userTeam: res.data.team })
              get().checkAndRefreshSubscription()
            }
          )
        },

        checkAndRefreshSubscription: async () => {
          /*const { subscription } = get().userTeam
          if (!subscription?.currentPeriodEnd) return

          const now = new Date()
          const periodEnd = new Date(subscription.currentPeriodEnd)

          if (now >= periodEnd) await get().getSubscriptionStatus()*/
        },

        getSubscriptionStatus: async () => {
          let subscription: TeamSubscription | null = null
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch(`/api/teams/${get().user.currentTeam.uuid}/subscription`),
            (res) => {
              subscription = res.data.subscription
              if (subscription) {
                set({ userTeam: { ...get().userTeam, subscription } })
              }
            },
            { silentError: true }
          )
          return subscription
        },

        createCheckoutSession: async (priceId: string) => {
          let checkoutUrl = ''
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/teams/${get().user.currentTeam.uuid}/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  priceId: priceId,
                  successUrl: `${window.location.origin}/dashboard/pricing?checkout=success`,
                  cancelUrl: `${window.location.origin}/dashboard/pricing?checkout=cancelled`
                })
              }),
            (res) => (checkoutUrl = res.data.checkout_url)
          )
          return checkoutUrl
        },

        handleCheckout: async (priceId: string) => {
          try {
            set({ loading: true })
            const checkoutUrl = await get().createCheckoutSession(priceId)
            if (!checkoutUrl) return 'failed'
            console.log(checkoutUrl)
            const tab = window.open(checkoutUrl)
            if (!tab) {
              set({ loading: false })
              toast({
                variant: 'error',
                title: 'Popup blocked',
                description: 'Please allow popups and try again'
              })
              throw new Error('Popup blocked')
            }

            return new Promise((resolve) => {
              const checkInterval = setInterval(() => {
                try {
                  if (tab.closed) {
                    clearInterval(checkInterval)
                    set({ loading: false })
                    get().getSubscriptionStatus()
                    resolve('closed')
                  }
                } catch (error) {
                  // Ignore cross-origin errors
                }
              }, 1000)

              // Handle postMessage events for success/cancel
              const messageHandler = (event: MessageEvent) => {
                if (!event.origin.includes('stripe.com') && event.origin !== window.location.origin)
                  return

                if (event.data.type === 'STRIPE_CHECKOUT_SUCCESS') {
                  clearInterval(checkInterval)
                  window.removeEventListener('message', messageHandler)
                  tab.close()
                  set({ loading: false })
                  //get().getSubscriptionStatus()
                  //get().getUserTeamDetail(get().userTeam.uuid)
                  toast({ variant: 'success', title: 'Subscription updated successfully!' })
                  resolve('success')
                } else if (event.data.type === 'STRIPE_CHECKOUT_CANCEL') {
                  clearInterval(checkInterval)
                  window.removeEventListener('message', messageHandler)
                  tab.close()
                  set({ loading: false })
                  resolve('cancelled')
                }
              }

              window.addEventListener('message', messageHandler)
              tab.focus()

              // 15min timeout
              setTimeout(() => {
                clearInterval(checkInterval)
                window.removeEventListener('message', messageHandler)
                set({ loading: false })
                resolve('timeout')
              }, 900000)
            })
          } catch (error) {
            set({ loading: false })
            toast({ variant: 'error', title: 'Failed to create checkout session' })
            throw error
          }
        },

        cancelSubscription: async () => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/teams/${get().user.currentTeam.uuid}/subscription`, { method: 'DELETE' }),
            (res) => {
              get().getSubscriptionStatus()
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        resumeSubscription: async () => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/teams/${get().user.currentTeam.uuid}/subscription/resume`, {
                method: 'POST'
              }),
            (res) => {
              get().getSubscriptionStatus()
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        getSubscriptionPlans: async () => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch(`/api/plans`, { method: 'GET' }),
            (res) => {
              set({ subscriptionPlans: res.data.plans })
            }
          )
        },

        disable2FA: async (code: number) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch('/api/2fa', { method: 'DELETE', body: JSON.stringify(code) }),
            (res) => {
              get().getUser()
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        confirm2FA: async (code: number) => {
          let response = {}
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch('/api/2fa/confirm', { method: 'POST', body: JSON.stringify(Number(code)) }),
            (res) => {
              response = res
              get().getUser()
            }
          )
          return response
        },

        get2FACode: async () => {
          let response = {}
          const set2FASecret = await fetch('/api/2fa', { method: 'POST' })
          if (set2FASecret.ok) {
            await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
              () => fetch('/api/2fa', { method: 'GET' }),
              (res) => (response = res)
            )
            return response
          } else {
            toast({ variant: 'success', title: 'Unable to set 2FA secret!' })
          }
        },

        switchTeam: async (teamId: string) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () => fetch(`/api/teams/${teamId}/switch`, { method: 'POST' }),
            (res) => {
              // Resetting all values that rely on user
              useSiteStore.setState({ sites: [] })
              useSiteStore.setState({ site: {} as SiteDetail })
              useSiteStore.setState({ environment: {} as SiteEnvironment })
              useEditorStore.setState({ collections: [] })
              useEditorStore.setState({ sections: [] })
              useManagerStore.setState({ allEntries: [] })
              useMediaStore.setState({ mediaLib: [] })
              get().getUser()
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        inviteTeamMembers: async (emails: string[]) => {
          const reqBody = { emails: emails }
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/teams/${get().user.currentTeam.uuid}/invite`, {
                method: 'POST',
                body: JSON.stringify(reqBody)
              }),
            (res) => toast({ variant: 'success', title: res.message })
          )
        },

        acceptTeamInvite: async (inviteCode: string) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/accept-invite`, {
                method: 'POST',
                body: JSON.stringify(inviteCode)
              }),
            (res) => {
              get().getUser()
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        forgotPassword: async (data: FormData) => {
          let response = {} as BreaseAPIResponse
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/forgot-password`, {
                method: 'POST',
                body: data
              }),
            (res) => {
              response = res
              toast({ variant: 'success', title: res.message })
            }
          )
          return response
        },

        requestPasswordChange: async () => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/profile/request-password-change`, {
                method: 'POST'
              }),
            (res) => {
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        resetPassword: async (data: FormData) => {
          let response = {} as BreaseAPIResponse
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/reset-password`, {
                method: 'POST',
                body: data
              }),
            (res) => {
              response = res
              toast({ variant: 'success', title: res.message })
            }
          )
          return response
        },

        verifyEmail: async (data: FormData) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/verify-email`, {
                method: 'POST',
                body: data
              }),
            (res) => {
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        resendVerifyEmail: async (data: FormData) => {
          await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
            () =>
              fetch(`/api/resend-verify-email`, {
                method: 'POST',
                body: data
              }),
            (res) => {
              toast({ variant: 'success', title: res.message })
            }
          )
        },

        storeHydrated: false
      }),
      {
        name: 'brease-user-storage',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (_state, error) => {
          if (error) {
            console.error('An error happened during hydration', error)
          } else {
            setTimeout(() => {
              useUserStore.setState({ storeHydrated: true })
              const currentState = useUserStore.getState()
              if (currentState.user?.currentTeam?.uuid) {
                //currentState.checkAndRefreshSubscription()
                currentState.getSubscriptionPlans()
              }
            }, 0)
          }
        },
        partialize: (state) => ({
          user: state.user
        })
      }
    )
  )
)
