import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { useEffect, useState } from 'react'
import AppRoutes from 'routing/AppRoutes'
import { useGetUserQuery, useRefreshTokenMutation } from 'store/services/advApi'
import { setTokens } from 'store/slices/authSlice'
import { setIsMobile } from 'store/slices/uiSlice'
import { setUser } from 'store/slices/userSlice'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

function App() {
  const dispatch = useAppDispatch()
  const [isAuth, setIsAuth] = useState(false)
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  useEffect(() => {
    const localStorageTokens = localStorage.getItem('tokens')

    if (localStorageTokens) {
      const parsedTokens = JSON.parse(localStorageTokens)
      console.log('Parsed tokens: ', parsedTokens)
      dispatch(setTokens(parsedTokens))
      setIsAuth(true)
    }
  }, [dispatch])

  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading,
    status: queryStatus,
  } = useGetUserQuery(null, {
    skip: !isAuth,
    refetchOnReconnect: true,
  })

  const handleUserError = async () => {
    if (userError && 'status' in userError) {
      const userErrorStatus = userError.status
      console.log('user error', userErrorStatus)

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
          useGetUserQuery(null)
        } catch (error) {
          console.error('Ошибка обновления токена:', error)
        }
      }
    }
  }

  useEffect(() => {
    console.log('123')
    handleUserError()
    dispatch(setUser(userData))
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
