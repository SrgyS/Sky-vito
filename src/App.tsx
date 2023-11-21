import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { useEffect, useLayoutEffect, useState } from 'react'

import AppRoutes from 'routing/AppRoutes'
import {
  useGetUserMutation,
  useRefreshTokenMutation,
} from 'store/services/advApi'
import { setTokens } from 'store/slices/authSlice'
import { setIsMobile } from 'store/slices/uiSlice'
import { setUser } from 'store/slices/userSlice'

function App() {
  const dispatch = useAppDispatch()
  const [isAuth, setIsAuth] = useState(false)
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  useLayoutEffect(() => {
    const localStorageTokens = localStorage.getItem('tokens')

    if (localStorageTokens) {
      const parsedTokens = JSON.parse(localStorageTokens)
      console.log('Parsed tokens: ', parsedTokens)
      dispatch(setTokens(parsedTokens))
      setIsAuth(true)
      getUser(null)
    }
  }, [dispatch])

  const [
    getUser,
    {
      isError: isUserError,
      isSuccess: isUseruccess,

      data: userData,
      error: userError,
    },
  ] = useGetUserMutation()

  const handleUserError = async () => {
    if (userError && 'status' in userError) {
      const userErrorStatus = userError.status

      if (userErrorStatus === 401) {
        if (!access_token || !refresh_token) {
          console.error('Токены не заданы')
          return
        }
        try {
          const refreshResult = await refreshToken({
            access_token,
            refresh_token,
          })
          console.log('refresh1', refreshResult)
          getUser(null)
        } catch (error) {
          console.error('Ошибка обновления токена:', error)
          setIsAuth(false)
        }
      }
    }
  }

  useEffect(() => {
    console.log('123')
    handleUserError()

    userData && dispatch(setUser(userData))
  }, [userError, userData, dispatch])

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 590
      dispatch(setIsMobile(isMobile))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  useEffect(() => {
    if (userData) {
      console.log(`User data:`, userData)
      dispatch(setUser(userData))
    }
  }, [userData])

  return <AppRoutes />
}

export default App
