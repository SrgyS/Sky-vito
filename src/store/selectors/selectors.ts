import { RootState } from 'store/store'

export const selectCurrentAdv = (state: RootState) => state.advs.currentAdv
export const selectTokens = (state: RootState) => state.auth
export const selectIsOpen = (state: RootState) => state.advs.isOpenModal
