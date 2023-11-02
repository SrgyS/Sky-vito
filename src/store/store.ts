import { configureStore } from '@reduxjs/toolkit'
import { advApi } from './services/advApi'

export const store = configureStore({
  reducer: {
    [advApi.reducerPath]: advApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(advApi.middleware),
})
