import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'brease-api',
      name: 'Brease API',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const fetchLogin = await fetch(
          // fetch login credentials to get back  userToken
          process.env.API_URL +
            '/login?' +
            new URLSearchParams([
              ['email', credentials.email],
              ['password', credentials.password],
              ['token_name', 'insomnia']
            ]),
          {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
          }
        )
        if (fetchLogin.ok && fetchLogin.status === 204) {
          // check for unverified email
          throw new Error('EMAIL_VERIFY')
        } else if (fetchLogin.ok) {
          // if email is verified get userToken
          const {
            data: { token: userToken }
          } = await fetchLogin.json()
          // check for 2FA
          if (fetchLogin.status === 206) {
            throw new Error('2FA')
          } else if (userToken) {
            return {
              id: '0',
              name: '@username',
              email: 'placeholder@email.com',
              userToken: userToken
            }
          }
        }

        return null
      }
    }),
    CredentialsProvider({
      id: 'brease-api-2fa',
      name: 'Brease API 2FA',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        code: { label: 'Code', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const fetchLogin = await fetch(
          // fetch login ceredentials to get back auth token
          process.env.API_URL +
            '/login2fa?' +
            new URLSearchParams([
              ['email', credentials.email],
              ['password', credentials.password],
              ['token_name', 'insomnia'],
              ['code', credentials.code]
            ]),
          {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
          }
        )
        const {
          data: { token: userToken }
        } = await fetchLogin.json()
        if (fetchLogin.ok && userToken) {
          return {
            id: '0',
            name: '@username',
            email: 'placeholder@email.com',
            userToken: userToken
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { accessToken: user.userToken }
      }
      return token
      // TODO: handle token expire
      //if (new Date().getTime() < (token as any).accessTokenExpiration)
      //  return token;
      //return await refreshToken(token);
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login'
  }
}
