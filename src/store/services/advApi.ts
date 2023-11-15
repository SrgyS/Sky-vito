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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTokens(data))
        } catch (error) {
          console.log('login error', error)
        }
      },
    }),

    refreshToken: build.mutation({
      query: (body: { access_token: string; refresh_token: string }) => ({
        url: 'auth/login',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTokens(data))
        } catch (error) {
          console.log('refresh token', error)
        }
      },
    }),

    getUser: build.query({
      query: () => '/user',
      providesTags: ['User'],
      // onQueryStarted: async (arg, { queryFulfilled }) => {
      //   const { data } = await queryFulfilled

      //   if (data) {
      //     const userData = {
      //       id: data.id,
      //       email: data.email,
      //     }

      //     localStorage.setItem('user', JSON.stringify(userData))
      //   } else {
      //     console.error('Ошибка получения данных пользователя')
      //   }
      // },
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
      query: (avatar) => {
        const formData = new FormData()
        formData.append('file', avatar)
        return {
          url: '/user/avatar',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['User', 'Adv'],
    }),
    getAllAdvs: build.query({
      query: () => ({
        url: '/ads',
      }),
      providesTags: ['Adv'],
    }),

    getAdvById: build.query({
      query: (id: string) => ({
        url: `/ads/${id}`,
      }),
      providesTags: ['Adv', 'User'],
    }),
    getSellerAdvs: build.query({
      query: (sellerId = null) => ({
        url: '/ads',
        params: {
          user_id: sellerId,
        },
      }),
      providesTags: ['Adv', 'User'],
    }),
    getAdvComments: build.query({
      query: (id: string) => ({
        url: `/ads/${id}/comments`,
      }),
      providesTags: ['Adv', 'User'],
    }),
    addAdv: build.mutation({
      query: (data: IAddNewAdv) => {
        const { title, description, price, imgFiles } = data
        const params = new URLSearchParams()

        params.append('title', title)
        if (description) {
          params.append('description', description)
        }

        if (price) {
          params.append('price', price.toString())
        }

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

    addTextAdv: build.mutation({
      query: (formData: IAddNewAdv) => ({
        url: '/adstext',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Adv'],
    }),

    deleteAdv: build.mutation({
      query: (id: string | number) => ({
        url: `/ads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Adv'],
    }),
    deleteImg: build.mutation({
      query: (data) => ({
        url: `ads/${data.id}/image?file_url=${data.imgUrl}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Adv'],
    }),
    uploadImg: build.mutation({
      query: (uploadImgData) => {
        const formData = new FormData()
        formData.append('file', uploadImgData.imgFile)
        return {
          url: `ads/${uploadImgData.id}/image`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Adv'],
    }),
    editAdv: build.mutation({
      query: (editData) => ({
        url: `/ads/${editData.id}`,
        method: 'PATCH',
        body: editData,
      }),
      invalidatesTags: ['Adv'],
    }),
    uploadComment: build.mutation({
      query: (data) => ({
        url: `ads/${data.id}/comments`,
        method: 'POST',
        body: data.formData,
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
  useAddTextAdvMutation,
  useDeleteImgMutation,
  useEditAdvMutation,
  useUploadImgMutation,
  useUploadCommentMutation,
} = advApi
