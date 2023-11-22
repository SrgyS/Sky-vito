import { advApi } from './services/advApi'
import advsSlice from './slices/advsSlice'
import { authApi } from './services/authApi'
import authSlice from './slices/authSlice'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import uiSlice from './slices/uiSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    advs: advsSlice,
    user: userSlice,
    ui: uiSlice,
    [advApi.reducerPath]: advApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(advApi.middleware, authApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
setupListeners(store.dispatch)
