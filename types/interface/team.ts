import { UserProfileDetail } from './user'

export type TeamSubscription = {
  uuid: string | null
  name: string
  priceId: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  customerId: string | null
}

export type Team = {
  uuid: string
  name: string
  subscription: TeamSubscription
  sites: any[]
  users: UserProfileDetail[]
}

export type UserTeam = {
  uuid: string
  userRole: string
  name: string
  image: string
}
