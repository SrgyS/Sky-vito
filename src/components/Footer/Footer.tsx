import S from './Footer.module.scss'
import homeIconUrl from 'assets/img/icon_home.png'
import addIconUrl from 'assets/img/icon_plus.png'
import profileIconUrl from 'assets/img/icon_profile.png'
import logoutIconUrl from 'assets/img/move_item.png'
import { useAppDispatch } from 'hooks/reduxHooks'
import { useAuth } from 'hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setCloseModal, setOpenModal } from 'store/slices/advsSlice'
import { logout } from 'store/slices/userSlice'

const Footer = () => {
  const { isAuth, id } = useAuth()
  const location = useLocation()
  const isProfilePage = location.pathname === `/user/${id}`
  const dispatch = useAppDispatch()
  const handleOpenModal = () => {
    dispatch(setOpenModal())
  }
  const navigate = useNavigate()

  const handleCloseModal = () => {
    dispatch(setCloseModal())
  }

  const handleLogout = () => {
    dispatch(logout())
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
          <div className={S.footer__img} onClick={handleOpenModal}>
            <img src={addIconUrl} alt="add icon" />
          </div>
        ) : (
          <Link to="/signin">
            <div className={S.footer__img}>
              <img src={addIconUrl} alt="home" />
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
      </div>
    </footer>
  )
}

export default Footer
