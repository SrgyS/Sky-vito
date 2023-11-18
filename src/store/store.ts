import { configureStore } from '@reduxjs/toolkit'
import { advApi } from './services/advApi'

import advsSlice from './slices/advsSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    advs: advsSlice,
    user: userSlice,
    ui: uiSlice,
    [advApi.reducerPath]: advApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(advApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
setupListeners(store.dispatch)
