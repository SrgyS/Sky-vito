import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setCloseModal, setOpenModal } from 'store/slices/advsSlice'

import AddNewAdv from 'components/modals/AddNewAdv'
import S from './Footer.module.scss'
import addIconUrl from 'assets/img/icon_plus.png'
import homeIconUrl from 'assets/img/icon_home.png'
import { logout } from 'store/slices/userSlice'
import logoutIconUrl from 'assets/img/move_item.png'
import profileIconUrl from 'assets/img/icon_profile.png'
import { resetTokens } from 'store/slices/authSlice'
import { useAppDispatch } from 'hooks/reduxHooks'
import { useAuth } from 'hooks/useAuth'
import { useState } from 'react'

const Footer = () => {
  const { isAuth, id } = useAuth()
  const location = useLocation()
  const isProfilePage = location.pathname.startsWith('/user/')
  const dispatch = useAppDispatch()
  const handleOpenModal = () => {
    dispatch(setOpenModal())
  }
  const [isAddAdvModalOpen, setIsAddAdvModalOpen] = useState(false)

  const navigate = useNavigate()

  const openAddAdvwModal = () => {
    setIsAddAdvModalOpen(true)
    dispatch(setOpenModal())
  }
  const closeAddAdvModal = () => {
    setIsAddAdvModalOpen(false)
    dispatch(setCloseModal())
  }

  const handleCloseModal = () => {
    dispatch(setCloseModal())
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetTokens())
    navigate('/')
  }
  return (
    <footer className={S.footer}>
      <div className={S.footer__container}>
        <Link to="/" onClick={handleCloseModal}>
          <div className={S.footer__img}>
            <img src={homeIconUrl} alt="home icon" />
          </div>
        </Link>
        {isAuth ? (
          <div className={S.footer__img} onClick={openAddAdvwModal}>
            <img src={addIconUrl} alt="add icon" />
          </div>
        ) : (
          <Link to="/signin">
            <div className={S.footer__img}>
              <img src={addIconUrl} alt="add icon" />
            </div>
          </Link>
        )}
        {isAuth && isProfilePage ? (
          <div className={S.footer__img} onClick={handleLogout}>
            <img src={logoutIconUrl} alt="logout icon" />
          </div>
        ) : (
          <Link
            to={isAuth ? `/user/${id}` : '/signin'}
            onClick={handleCloseModal}
          >
            <div className={S.footer__img}>
              <img src={profileIconUrl} alt="home" />
            </div>
          </Link>
        )}
        <AddNewAdv isOpen={isAddAdvModalOpen} onClose={closeAddAdvModal} />
      </div>
    </footer>
  )
}

export default Footer
