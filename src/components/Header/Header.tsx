import HeaderWrapper from './HeaderWrapper'
import HeaderFirstRow from './HeaderFirstRow'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Button from 'common/buttons/Button'
import { useAuth } from 'hooks/useAuth'
import { logout } from 'store/slices/userSlice'
import { useAppDispatch } from 'hooks/reduxHooks'
import AddNewAdv from 'components/modals/AddNewAdv'
import { setOpenModal } from 'store/slices/advsSlice'
import { resetTokens, setTokens } from 'store/slices/authSlice'

const Header = () => {
  const location = useLocation()
  const { isAuth, id } = useAuth()
  const isProfilePage = location.pathname === `/user/${id}`
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleOpenModal = () => {
    dispatch(setOpenModal())
  }
  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetTokens())
    navigate('/')
  }
  return (
    <>
      <HeaderWrapper>
        <HeaderFirstRow>
          {isAuth ? (
            <div>
              <Button
                text="Разместить объявление"
                className="header_btn"
                onClick={handleOpenModal}
              />
              {isAuth && isProfilePage ? (
                <Button
                  text="Выйти"
                  className="header_btn"
                  onClick={handleLogout}
                />
              ) : (
                <Link to={`/user/${id}`}>
                  <Button text="Личный кабинет" className="header_btn" />
                </Link>
              )}
            </div>
          ) : (
            <Link to="/signin">
              <Button text="Вход в личный кабинет" className="header_btn" />
            </Link>
          )}
        </HeaderFirstRow>
      </HeaderWrapper>
      <AddNewAdv />
    </>
  )
}

export default Header
