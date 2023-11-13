import { configureStore } from '@reduxjs/toolkit'
import { advApi } from './services/advApi'

import advsSlice from './slices/advsSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    advs: advsSlice,
    user: userSlice,
    [advApi.reducerPath]: advApi.reducer,
    // [authApi.reducerPath]: authApi.reducer,
    // [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      advApi.middleware,
      // authApi.middleware,
      // userApi.middleware,
    ),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
setupListeners(store.dispatch)
