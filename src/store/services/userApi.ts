import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8090',
  }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => ({
        url: '/user',
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' +
            JSON.parse(sessionStorage.getItem('tokens') || '{}')?.access,
        },
      }),
    }),
    updateUser: build.mutation({
      query: (body: {
        email?: string
        name?: string
        surname?: string
        role?: string
        city?: string
        phone?: string
      }) => ({
        url: '/user',
        method: 'PATCH',
        body,
        headers: {
          Authorization:
            'Bearer ' +
            JSON.parse(sessionStorage.getItem('tokens') || '{}')?.access,
        },
      }),
    }),
  }),
})

export const { useGetUserQuery, useUpdateUserMutation } = userApi
