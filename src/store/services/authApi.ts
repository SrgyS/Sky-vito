import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { useNavigate } from 'react-router-dom'
import { setTokens } from 'store/slices/authSlice'
import { logout } from 'store/slices/userSlice'
import { RootState } from 'store/store'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

const baseQueryWithReauth = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>,
) => {
  const navigate = useNavigate()
  const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8090/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  const result = await baseQuery(args, api, {})
  console.log('Результат первого запроса', { result })

  if (result?.error?.status !== 401) {
    return result
  }

  const forceLogout = () => {
    console.log('Принудительная авторизация!')
    api.dispatch(logout())
    navigate('/')
  }
  let access: string | null = null
  let refresh: string | null = null

  const tokensData = sessionStorage.getItem('tokens')
  if (tokensData) {
    const tokens = JSON.parse(tokensData)
    access = tokens.access
    refresh = tokens.refresh
  }

  console.log('Данные пользователя в сторе refresh', refresh)
  console.log('Данные пользователя в сторе access', access)

  const { auth } = api.getState() as RootState
  console.log('Данные пользователя в сторе', { auth })

  if (!refresh) {
    console.log('no token')
    return forceLogout()
  }

  const refreshResult = (await baseQuery(
    {
      url: '/auth/login',
      method: 'PUT',
      body: {
        access_token: access,
        refresh_token: refresh,
      },
    },
    api,
    extraOptions,
  )) as {
    data: {
      access_token: string
      refresh_token: string
    }
  }
  console.log('Результат запроса на обновление токена', { refreshResult })

  // if (!refreshResult.data.access_token) {
  //   return forceLogout()
  // }
  if (refreshResult.data && refreshResult.data.access_token) {
    // Добавьте проверку наличия свойства 'data' и 'access_token'
    // Здесь вы можете безопасно использовать 'refreshResult.data.access_token'
  } else {
    return forceLogout()
  }

  api.dispatch(
    setTokens({
      ...auth,
      access_token: refreshResult.data.access_token,
      refresh_token: refreshResult.data.refresh_token,
    }),
  )
  const retryResult = await baseQuery(args, api, extraOptions)

  // Если повторный запрос выполнился с 401 кодом, то что-то совсем пошло не так, отправляем на принудительную ручную авторизацию
  if (retryResult?.error?.status === 401) {
    return forceLogout()
  }

  console.debug('Повторный запрос завершился успешно')

  return retryResult
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (body: {
        email: string
        password: string
        name?: string
        surname?: string
        role?: string
        city?: string
        phone?: string
      }) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    loginUser: build.mutation({
      query: (body: { email: string; password: string }) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),

    updateTokens: build.mutation({
      query: (body: { access_token: string; refresh_token: string }) => ({
        url: '/auth/login',
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateTokensMutation,
} = authApi
