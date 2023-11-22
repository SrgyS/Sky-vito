import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { useEffect, useLayoutEffect, useState } from 'react'

import AppRoutes from 'routing/AppRoutes'
import { setIsMobile } from 'store/slices/uiSlice'
import { setTokens } from 'store/slices/authSlice'
import { setUser } from 'store/slices/userSlice'
import { useGetUserMutation } from 'store/services/advApi'

function App() {
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    const localStorageTokens = localStorage.getItem('tokens')

    if (localStorageTokens) {
      const parsedTokens = JSON.parse(localStorageTokens)
      dispatch(setTokens(parsedTokens))
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
      dispatch(setUser(userData))
    }
  }, [userData])

  return <AppRoutes />
}

export default App
