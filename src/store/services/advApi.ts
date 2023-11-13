import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setTokens } from 'store/slices/authSlice'
import { setUser } from 'store/slices/userSlice'
import { RootState } from 'store/store'
import { IAddNewAdv } from 'types'

export const advApi = createApi({
  reducerPath: 'advApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8090',
    prepareHeaders: (headers, { getState }) => {
      const storedTokens = localStorage.getItem('tokens')
      const token = storedTokens ? JSON.parse(storedTokens).access_token : null

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Adv', 'User', 'Auth'],
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
      // onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
      //   const { data } = await queryFulfilled
      //   dispatch(setTokens(data))
      // },
    }),

    refreshToken: build.mutation({
      query: (body: { access_token: string; refresh_token: string }) => ({
        url: 'auth/login',
        method: 'PUT',
        body,
      }),
      // onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
      //   const { data } = await queryFulfilled
      //   dispatch(setTokens(data))
      // },
    }),

    getUser: build.query({
      query: () => '/user',
      providesTags: (result, error, id) => [{ type: 'User', id }],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        const { data } = await queryFulfilled

        const userData = {
          id: data.id,
          email: data.email,
        }

        localStorage.setItem('user', JSON.stringify(userData))
      },
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
      }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: build.mutation({
      query: (formData) => ({
        url: '/user/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    getAllAdvs: build.query({
      query: () => ({
        url: '/ads',
      }),
    }),

    getAdvById: build.query({
      query: (id: string) => ({
        url: `/ads/${id}`,
      }),
    }),
    getSellerAdvs: build.query({
      query: (sellerId = null) => ({
        url: '/ads',
        params: {
          user_id: sellerId,
        },
      }),
      providesTags: ['Adv'],
    }),
    getAdvComments: build.query({
      query: (id: string) => ({
        url: `/ads/${id}/comments`,
      }),
    }),
    addAdv: build.mutation({
      query: (data: IAddNewAdv) => {
        const { title, description, price, imgFiles } = data
        const params = new URLSearchParams()

        params.append('title', title)
        params.append('description', description || '')
        params.append('price', price?.toString() || '')

        const queryString = params.toString()

        const formData = new FormData()

        if (imgFiles) {
          imgFiles.forEach((file: File | null) => {
            if (file) {
              formData.append('files', file, file.name)
            }
          })
        }
        return {
          url: `/ads?${queryString}`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Adv'],
    }),
    deleteAdv: build.mutation({
      query: (id: string | number) => ({
        url: `/ads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Adv'],
    }),
  }),
})

export const {
  useGetAllAdvsQuery,
  useGetAdvByIdQuery,
  useGetSellerAdvsQuery,
  useGetAdvCommentsQuery,
  useAddAdvMutation,
  useGetUserQuery,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useDeleteAdvMutation,
} = advApi
