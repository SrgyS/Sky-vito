import { Navigate, Outlet } from 'react-router-dom'
type Props = {
  redirectPath?: string
  isAllowed: boolean
}
export const ProtectedRoute = ({
  redirectPath = '/signin',
  isAllowed,
}: Props) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace={true} />
  }
  return <Outlet />
}
