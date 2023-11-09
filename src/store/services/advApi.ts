import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const advApi = createApi({
  reducerPath: 'advApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8090/',
  }),
  tagTypes: ['Adv'],
  endpoints: (build) => ({
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
    }),
    getAdvComments: build.query({
      query: (id: string) => ({
        url: `/ads/${id}/comments`,
      }),
    }),
  }),
})

export const {
  useGetAllAdvsQuery,
  useGetAdvByIdQuery,
  useGetSellerAdvsQuery,
  useGetAdvCommentsQuery,
} = advApi
