import { redirect } from 'remix'

export const loader = () => redirect(`/${new Date().getFullYear()}`)
