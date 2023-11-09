import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUserState {
  name?: string | null
  password: string | null
  surname?: string | null
  phone?: string | null
  email?: string | null
  id?: string | number | null
  city?: string | null
  sells_from?: string | null
  avatar: string | null
}

const initialState: IUserState = {
  name: null,
  password: null,
  surname: null,
  email: null,
  id: null,
  city: null,
  phone: null,
  sells_from: null,
  avatar: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userData: IUserState }>) => {
      const userData = action.payload
      localStorage.setItem('user', JSON.stringify(userData))
      Object.assign(state, userData)
    },

    logout: (state) => {
      Object.assign(state, initialState)
      localStorage.clear()
      sessionStorage.clear()
    },
  },
})

export const { setUser, logout } = userSlice.actions

export default userSlice.reducer
