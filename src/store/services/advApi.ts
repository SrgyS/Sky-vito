import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { IAddNewAdv, IUser } from 'types'
import { IUserState, logout, setUser } from 'store/slices/userSlice'

import { RootState } from 'store/store'
import { setTokens } from 'store/slices/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8090',
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token
    if (access_token) {
      headers.set('Authorization', `Bearer ${access_token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  console.debug('Результат первого запроса', { result })

  if (result?.error?.status !== 401) {
    return result
  }

  let refresh_token: string | null = null
  let access_token: string | null = null

  const tokensData = localStorage.getItem('tokens')
  if (tokensData) {
    const tokens = JSON.parse(tokensData)
    access_token = tokens.access_token
    refresh_token = tokens.refresh_token
  }

  console.debug('Данные пользователя в сторе refresh', refresh_token)

  const { auth } = api.getState() as RootState
  console.debug('Данные пользователя в сторе', { auth })

  if (!refresh_token) {
    console.debug('no token')
  }

  const refreshResult = (await baseQuery(
    {
      url: 'auth/login',
      method: 'PUT',
      body: {
        refresh_token,
        access_token,
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
  console.debug('Результат запроса на обновление токена', { refreshResult })

  if (refreshResult.data.access_token) {
    api.dispatch(
      setTokens({
        ...auth,
        access_token: refreshResult.data.access_token,
        refresh_token: refreshResult.data.refresh_token,
      }),
    )
  }

  const retryResult = await baseQuery(args, api, extraOptions)

  console.debug('Повторный запрос завершился успешно')
  return retryResult
}

export const advApi = createApi({
  reducerPath: 'advApi',
  baseQuery: baseQueryWithReauth,

  tagTypes: ['Adv', 'User', 'Auth'],
  endpoints: (build) => ({
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
          console.debug('refresh token', error)
        }
      },
    }),

    getUser: build.mutation({
      query: () => '/user',
      transformResponse: (response: IUserState) => {
        localStorage.setItem('user', JSON.stringify(response))

        return response
      },

      invalidatesTags: ['User'],
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
      invalidatesTags: ['Adv', 'User'],
    }),
    uploadImg: build.mutation({
      query: ({ uploadImgFile, id }) => {
        const formData = new FormData()
        formData.append('file', uploadImgFile)
        return {
          url: `ads/${id}/image`,
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
  useGetUserMutation,
  useRefreshTokenMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useDeleteAdvMutation,
  useAddTextAdvMutation,
  useDeleteImgMutation,
  useEditAdvMutation,
  useUploadImgMutation,
  useUploadCommentMutation,
} = advApi
