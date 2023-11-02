import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const advApi = createApi({
  reducerPath: 'advApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8090/',
  }),
  tagTypes: ['Adv'],
  endpoints: (build) => ({
    getAdv: build.query({
      query: () => ({
        url: '/ads',
      }),
    }),
  }),
})

export const { useGetAdvQuery } = advApi
