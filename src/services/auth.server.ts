import { createCookieSessionStorage } from 'remix'
import { Authenticator } from 'remix-auth'
import { GitHubStrategy } from 'remix-auth-github'

type User = {
  id: string
  name: string
  email: string
  image: string
}

if (!process.env.GITHUB_ID) {
  throw new Error('Missing GITHUB_ID env')
}

if (!process.env.GITHUB_SECRET) {
  throw new Error('Missing GITHUB_SECRET env')
}

if (!process.env.SESSION_SECRET) {
  throw new Error('Missing SESSION_SECRET env')
}

if (!process.env.SITE_URL) {
  throw new Error('Missing SITE_URL env')
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

const authenticator = new Authenticator<User>(sessionStorage)

export const logout = async (request: Request) => sessionStorage.destroySession(
  await sessionStorage.getSession(request.headers.get('Cookie')),
)

export const login = (request: Request) => authenticator.authenticate('github', request)

export const callback = (request: Request) => authenticator.authenticate('github', request, {
  successRedirect: '/',
  failureRedirect: '/login',
})

export const getUser = (request: Request) => authenticator.isAuthenticated(request, {
  failureRedirect: '/login',
})

export const ensureGuest = (request: Request) => authenticator.isAuthenticated(request, {
  successRedirect: '/',
})


authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${process.env.SITE_URL}/login/callback`,
    },
    async ({ profile }) => {
      if (!process.env.GITHUB_ALLOWED_IDS?.split(',').includes(String(profile.id))) {
        throw new Error('Unauthorized')
      }

      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
      }
    }
    ,
  ),
)
