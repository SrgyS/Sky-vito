import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resetTokens, setTokens } from 'store/slices/authSlice'
import { setCloseModal, setOpenModal } from 'store/slices/advsSlice'
import { useEffect, useLayoutEffect, useState } from 'react'

import AddNewAdv from 'components/modals/AddNewAdv'
import Button from 'common/buttons/Button'
import HeaderContainer from './HeaderContainer'
import HeaderFirstRow from './HeaderContainer'
import HeaderWrapper from './HeaderWrapper'
import { logout } from 'store/slices/userSlice'
import { useAppDispatch } from 'hooks/reduxHooks'
import { useAuth } from 'hooks/useAuth'

const Header = () => {
  const location = useLocation()
  const { isAuth, id } = useAuth()

  const [isAddAdvModalOpen, setIsAddAdvModalOpen] = useState(false)

  const isProfilePage = location.pathname === `/user/${id}`

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleOpenModal = () => {
    setIsAddAdvModalOpen(true)
    dispatch(setOpenModal())
  }

  const handleCloseModal = () => {
    setIsAddAdvModalOpen(false)
    dispatch(setCloseModal())
  }
  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetTokens())
    navigate('/')
  }

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
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
        </HeaderContainer>
      </HeaderWrapper>
      <AddNewAdv onClose={handleCloseModal} isOpen={isAddAdvModalOpen} />
    </>
  )
}

export default Header
