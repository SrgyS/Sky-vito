import { createSlice } from '@reduxjs/toolkit'
import { IAdv } from 'types'
interface AdvsState {
  currentAdv: IAdv | null
  isOpenModal: boolean
}

const initialState: AdvsState = {
  currentAdv: null,
  isOpenModal: false,
}

export const advsSlice = createSlice({
  name: 'advsSlice',
  initialState,
  reducers: {
    setCurrentAdv: (state, action) => {
      state.currentAdv = action.payload
    },
    setOpenModal: (state) => {
      state.isOpenModal = true
    },
    setCloseModal: (state) => {
      state.isOpenModal = false
    },
  },
})

export const { setCurrentAdv, setCloseModal, setOpenModal } = advsSlice.actions

export default advsSlice.reducer
