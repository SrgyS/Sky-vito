import { useAppDispatch } from 'hooks/reduxHooks'
import { useEffect } from 'react'
import AppRoutes from 'routing/AppRoutes'
import { useGetUserQuery } from 'store/services/advApi'
import { setTokens } from 'store/slices/authSlice'
import { setUser } from 'store/slices/userSlice'

function App() {
  const dispatch = useAppDispatch()

  const storedUser = localStorage.getItem('user')
  const id = storedUser ? JSON.parse(storedUser).id : null
  console.log('user id', id)

  useEffect(() => {
    const localStorageTokens = localStorage.getItem('tokens')

    if (localStorageTokens) {
      const parsedTokens = JSON.parse(localStorageTokens)
      dispatch(setTokens(parsedTokens))
    }
  }, [dispatch])

  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading,
  } = useGetUserQuery(id)

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData))
    }
  }, [userData, dispatch])

  return <AppRoutes />
}

export default App
