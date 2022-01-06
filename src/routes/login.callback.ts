import { LoaderFunction } from 'remix'
import { callback } from '../services/auth.server'


export const loader: LoaderFunction = ({ request }) => callback(request)
