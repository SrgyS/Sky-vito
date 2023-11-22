import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IAuthState {
  access_token?: string | null
  refresh_token?: string | null
}

const initialState: IAuthState = {
  access_token: null,
  refresh_token: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ access_token: string; refresh_token: string }>,
    ) => {
      localStorage.setItem(
        'tokens',
        JSON.stringify({
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
        }),
      )
      state.access_token = action.payload.access_token
      state.refresh_token = action.payload.refresh_token
    },
    resetTokens: (state) => {
      state.access_token = null
      state.refresh_token = null
    },
  },
})

export const { setTokens, resetTokens } = authSlice.actions

export default authSlice.reducer
