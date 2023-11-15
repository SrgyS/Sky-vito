import S from './Footer.module.scss'
import homeIconUrl from 'assets/img/icon_01.png'
import addIconUrl from 'assets/img/icon_02.png'
import profileIconUrl from 'assets/img/icon_03.png'
import { useAppDispatch } from 'hooks/reduxHooks'
import { useAuth } from 'hooks/useAuth'
import { Link } from 'react-router-dom'
import { setOpenModal } from 'store/slices/advsSlice'

const Footer = () => {
  const dispatch = useAppDispatch()
  const handleOpenModal = () => {
    dispatch(setOpenModal())
  }

  const { isAuth, id } = useAuth()
  return (
    <footer className={S.footer}>
      <div className={S.footer__container}>
        <Link to="/">
          <div className={S.footer__img}>
            <img src={homeIconUrl} alt="home" />
          </div>
        </Link>
        {isAuth ? (
          <div className={S.footer__img} onClick={handleOpenModal}>
            <img src={addIconUrl} alt="home" />
          </div>
        ) : (
          <Link to="/signin">
            <div className={S.footer__img}>
              <img src={addIconUrl} alt="home" />
            </div>
          </Link>
        )}
        <Link to={isAuth ? `/user/${id}` : '/signin'}>
          <div className={S.footer__img}>
            <img src={profileIconUrl} alt="home" />
          </div>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
