import { RootState } from 'store/store'
import { useAppSelector } from './reduxHooks'

export function useCurrentAdv() {
  const { currentAdv } = useAppSelector((state: RootState) => state.advs)

  if (!currentAdv) {
    return {
      title: '',
      description: '',
      price: 0,
      id: 0,
      images: [],
      created_on: '',
      user_id: 0,
    }
  }

  return {
    title: currentAdv.title,
    description: currentAdv.description,
    price: currentAdv.price,
    id: currentAdv.id,
    images: currentAdv.images,
    created_on: currentAdv.created_on,
    user_id: currentAdv.user_id,
  }
}
