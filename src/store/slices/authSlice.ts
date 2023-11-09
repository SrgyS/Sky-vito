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
      sessionStorage.setItem(
        'tokens',
        JSON.stringify({
          access: action.payload.access_token,
          refresh: action.payload.refresh_token,
        }),
      )
      state.access_token = action.payload.access_token
      state.refresh_token = action.payload.refresh_token
    },
  },
})

export const { setTokens } = authSlice.actions

export default authSlice.reducer