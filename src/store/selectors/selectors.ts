import { RootState } from 'store/store'

export const selectorCurrentAdv = (state: RootState) => state.advs.currentAdv
export const selectorTokens = (state: RootState) => state.auth
