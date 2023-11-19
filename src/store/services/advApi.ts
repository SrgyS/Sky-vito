import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { useNavigate } from 'react-router-dom'
import { setTokens } from 'store/slices/authSlice'
import { IUserState, logout, setUser } from 'store/slices/userSlice'
import { RootState } from 'store/store'
import { IAddNewAdv, IUser } from 'types'

// const baseQueryWithReauth: BaseQueryFn<
//   string,
//   unknown,
//   Record<string, unknown>
// > = async (args, api, extraOptions) => {
//   const navigate = useNavigate()
//   const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://localhost:8090',
//     prepareHeaders: (headers, { getState }) => {
//       // const storedTokens = localStorage.getItem('tokens')
//       // const token = storedTokens ? JSON.parse(storedTokens).access_token : null
//       const token = (getState() as RootState).auth.access_token
//       console.log('Использую токен из локал стор', { token })
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`)
//       }
//       return headers
//     },
//   })

//   const result = await baseQueryWithReauth(args, api, extraOptions)

//   console.log('Результат первого запроса', { result })

//   if (result?.error?.status !== 401) {
//     return result
//   }

//   const forceLogout = () => {
//     api.dispatch(logout())
//     navigate('/signin')
//   }

//   let refresh_token: string | null = null
//   let access_token: string | null = null

//   const tokensData = localStorage.getItem('tokens')
//   if (tokensData) {
//     const tokens = JSON.parse(tokensData)
//     access_token = tokens.access_token
//     refresh_token = tokens.refresh_token
//   }

//   console.log('Данные пользователя в сторе refresh', refresh_token)

//   const { auth } = api.getState() as RootState
//   console.log('Данные пользователя в сторе', { auth })

//   if (!refresh_token) {
//     console.log('no token')
//     return forceLogout()
//   }

//   const refreshResult = (await baseQuery(
//     {
//       url: 'auth/login',
//       method: 'PUT',
//       body: {
//         refresh_token,
//         access_token,
//       },
//     },
//     api,
//     extraOptions,
//   )) as {
//     data: {
//       access_token: string
//       refresh_token: string
//     }
//   }
//   console.log('Результат запроса на обновление токена', { refreshResult })

//   if (!refreshResult.data.access_token) {
//     return forceLogout()
//   }

//   if (refreshResult.data.access_token) {
//     api.dispatch(
//       setTokens({
//         ...auth,
//         access_token: refreshResult.data.access_token,
//         refresh_token: refreshResult.data.refresh_token,
//       }),
//     )
//   }

//   const retryResult = await baseQuery(args, api, extraOptions)

//   // Если повторный запрос выполнился с 401 кодом, то что-то совсем пошло не так, отправляем на принудительную ручную авторизацию
//   if (retryResult?.error?.status === 401) {
//     return forceLogout()
//   }
//   console.log('Повторный запрос завершился успешно')
//   return retryResult
// }

export const advApi = createApi({
  reducerPath: 'advApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8090',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
      // const storedTokens = localStorage.getItem('tokens')
      // const token = storedTokens ? JSON.parse(storedTokens).access_token : null

      // if (token) {
      //   headers.set('Authorization', `Bearer ${token}`)
      // }
      // return headers
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

    getUser: build.mutation({
      query: () => '/user',
      transformResponse: (response: IUserState) => {
        localStorage.setItem('user', JSON.stringify(response))

        return response
      },
      // onQueryStarted: async (arg, { queryFulfilled }) => {
      //   const { data } = await queryFulfilled

      //   if (data) {
      //     localStorage.setItem('user', JSON.stringify(data))
      //     console.log('записал')
      //   } else {
      //     console.error('Ошибка получения данных пользователя')
      //   }
      // },
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
  useGetUserMutation,
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

// const baseQueryWithReauth = async (
//   args: string,
//   api: BaseQueryApi,
//   extraOptions: Record<string, unknown>,
// ) => {
//   const navigate = useNavigate()
//   const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://localhost:8090',
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.access_token
//       console.log('Использую токен из локал стор', { token })
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`)
//       }
//       return headers
//     },
//   })
//   const { auth } = api.getState() as RootState
//   const { access_token, refresh_token } = auth

//   if (!access_token || !refresh_token) {
//     console.error('Токены не заданы')
//     return
//   }
//   const forceLogout = () => {
//     api.dispatch(logout())
//     navigate('/signin')
//   }
//   const refreshResult = (await baseQuery(
//     {
//       url: 'auth/login',
//       method: 'PUT',
//       body: {
//         refresh_token,
//         access_token,
//       },
//     },
//     api,
//     extraOptions,
//   )) as {
//     data: {
//       access_token: string
//       refresh_token: string
//     }
//   }
//   console.log('Результат запроса на обновление токена', { refreshResult })

//   if (!refreshResult.data.access_token) {
//     return forceLogout()
//   }

//   if (refreshResult.data.access_token) {
//     api.dispatch(
//       setTokens({
//         ...auth,
//         access_token: refreshResult.data.access_token,
//         refresh_token: refreshResult.data.refresh_token,
//       }),
//     )
//   }

//   return baseQuery(args, api, extraOptions)
// }

// export const { useGetUserQuery: useGetUserWithReauthQuery } =
//   advApi.injectEndpoints({
//     endpoints: (builder) => ({
//       getUserWithReauth: builder.query({
//         query: () => 'user',
//         baseQuery: baseQueryWithReauth,
//       }),
//     }),
//     overrideExisting: true,
//   })
