import { createSlice } from '@reduxjs/toolkit'
import { IAdv } from 'types'
interface AdvsState {
  currentAdv: IAdv | null
}

const initialState: AdvsState = {
  currentAdv: null,
}

export const advsSlice = createSlice({
  name: 'advsSlice',
  initialState,
  reducers: {
    setCurrentAdv: (state, action) => {
      state.currentAdv = action.payload
    },
  },
})

export const { setCurrentAdv } = advsSlice.actions

export default advsSlice.reducer
