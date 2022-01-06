import { LoaderFunction, redirect } from 'remix'
import { logout } from '../services/auth.server'


export let loader: LoaderFunction = async ({ request }) =>
  redirect('/', {
    headers: {
      'Set-Cookie': await logout(request),
    },
  })
