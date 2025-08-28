/* eslint-disable no-unused-vars */

import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { Team, TeamSubscription } from './team'

export interface UserStore {
  storeHydrated: boolean
  loading: boolean
  user: UserProfileDetail
  userTeam: Team
  subscriptionPlans: SubscriptionPlan[]
  setLoading: (isLoading: boolean) => void
  getUser: () => Promise<void>
  updateUserProfile: (data: any) => Promise<void>
  getUserTeamDetail: (teamId: string) => Promise<any>
  disable2FA: (code: number) => Promise<void>
  confirm2FA: (code: number) => Promise<any>
  get2FACode: () => Promise<any>
  switchTeam: (teamId: string) => Promise<void>
  inviteTeamMembers: (emails: string[]) => Promise<void>
  acceptTeamInvite: (inviteId: string) => Promise<void>
  forgotPassword: (data: FormData) => Promise<BreaseAPIResponse>
  requestPasswordChange: () => Promise<void>
  resetPassword: (data: FormData) => Promise<BreaseAPIResponse>
  verifyEmail: (data: FormData) => Promise<void>
  resendVerifyEmail: (data: FormData) => Promise<void>

  createCheckoutSession: (priceId: string) => Promise<string>
  handleCheckout: (priceId: string) => Promise<string>
  getSubscriptionStatus: () => Promise<TeamSubscription | null>
  checkAndRefreshSubscription: () => Promise<void>
  cancelSubscription: () => Promise<void>
  resumeSubscription: () => Promise<void>
  getSubscriptionPlans: () => Promise<any>
}

export interface User {
  uuid: string
  firstName: string
  lastName: string
  email: string
  avatar?: string | null
}

export interface SiteUserRole {
  uuid: string
  name: UserRole
}

export interface SiteUser extends User {
  role: SiteUserRole
  fullName: string
}

export interface UserProfile extends User {
  currentTeam: {
    uuid: string
    image: string
    name: string
    userRole: UserRole
  }
  teams: Team[]
}

export interface UserProfileDetail extends UserProfile {
  has2fa: boolean
  // 2fa props
  theme: 'dark' | 'light' | 'system'
}

export enum UserRole {
  administrator = 'administrator',
  moderator = 'moderator',
  editor = 'editor',
  builder = 'builder',
  section_manager = 'section-manager',
  blogger = 'blogger',
  designer = 'designer'
}

export type SubscriptionPlan = {
  uuid: string
  code: string
  shortName: string
  name: string
  price: number | null
  formattedPrice: string
  stripePriceId: string
}
