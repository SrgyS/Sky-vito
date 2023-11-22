import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface IUiState {
  isMobile: boolean
}
const initialState: IUiState = {
  isMobile: window.innerWidth <= 590,
}

export const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    },
  },
})

export const { setIsMobile } = uiSlice.actions
export default uiSlice.reducer
