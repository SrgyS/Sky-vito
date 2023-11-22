import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { setTokens } from 'store/slices/authSlice'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8090',
  }),
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
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    loginUser: build.mutation({
      query: (body: { email: string; password: string }) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTokens(data))
        } catch (error) {
          console.error('login error', error)
        }
      },
    }),
  }),
})

export const { useLoginUserMutation, useRegisterUserMutation } = authApi
