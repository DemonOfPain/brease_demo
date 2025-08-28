/* eslint-disable no-unused-vars */
import { BreaseUser } from '@/interface/breaseUser'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: accessToken
    user: {
      userToken: string
    }
  }
  interface User {
    userToken: string
  }
}
