import { useAppDispatch } from 'hooks/reduxHooks'
import { useEffect } from 'react'
import AppRoutes from 'routing/AppRoutes'
import { setTokens } from 'store/slices/authSlice'

export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const localStorageTokens = localStorage.getItem('tokens')

    if (localStorageTokens) {
      const parsedTokens = JSON.parse(localStorageTokens)
      dispatch(setTokens(parsedTokens))
    }
  }, [dispatch])

  // const {
  //   data: userData,
  //   error: userError,
  //   isLoading: isUserLoading,
  // } = useGetUserQuery(id)
  return <AppRoutes />
}
