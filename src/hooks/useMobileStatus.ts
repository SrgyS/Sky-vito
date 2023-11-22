import { RootState } from 'store/store'
import { useAppSelector } from './reduxHooks'

export function useMobileStatus() {
  const { isMobile } = useAppSelector((state: RootState) => state.ui)
  return {
    isMobile,
  }
}
