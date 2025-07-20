// src/routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../auth/auth'

type Props = {
  children: JSX.Element
}

export default function PrivateRoute({ children }: Props) {
  return isAuthenticated() ? children : <Navigate to="/login" />
}
