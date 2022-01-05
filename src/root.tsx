import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import styles from './tailwind.css'

import type { MetaFunction } from 'remix'
import { useState } from 'react'
import { App } from './components/App'

export const meta: MetaFunction = () => ({ title: 'New Remix App' })

export const links = () => [{ rel: 'stylesheet', href: styles }]

export const loader = () => {
  try {
    require('dotenv/config')
  } catch (error) {
  }

  return null
}
export default function Root() {

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
    <App user={{}} onSearch={setSearchQuery}>
      <Outlet context={{ searchQuery }} />
    </App>
    <ScrollRestoration />
    <Scripts />
    {process.env.NODE_ENV === 'development' && <LiveReload />}
    </body>
    </html>
  )
}
