import { RootState } from 'store/store'
import { useAppSelector } from './reduxHooks'

export function useAuth() {
  const { email, id, password, name, surname, avatar, phone, city } =
    useAppSelector((state: RootState) => state.user)

  return {
    isAuth: !!email,
    email,
    id,
    password,
    name,
    avatar,
    surname,
    phone,
    city,
  }
}
