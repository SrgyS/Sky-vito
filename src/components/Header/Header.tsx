import React, { useState } from 'react'
import HeaderWrapper from './HeaderWrapper'
import HeaderFirstRow from './HeaderFirstRow'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HeaderRow from './HeaderRow'
import Logo from 'components/Logo/Logo'
import SearchInput from './Search'
import Button from 'common/buttons/Button'
import { useAuth } from 'hooks/useAuth'
import { logout } from 'store/slices/userSlice'
import { useAppDispatch } from 'hooks/reduxHooks'
import AddNewAdv from 'components/modals/AddNewAdv'
import { setOpenModal } from 'store/slices/advsSlice'

type Props = { handleSearch?: (value: string) => void; searchText?: string }

const Header = ({ handleSearch, searchText }: Props) => {
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { isAuth, id } = useAuth()
  const isProfilePage = location.pathname === `/user/${id}`
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleOpenModal = () => {
    dispatch(setOpenModal())
  }

  const handleLogout = () => {
    dispatch(logout())
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
        <HeaderRow>
          <Logo />
          {isHomePage && handleSearch ? (
            <SearchInput onSearch={handleSearch} value={searchText || ''} />
          ) : (
            <Link to="/">
              <Button text="Вернуться на главную" className="color_btn" />
            </Link>
          )}
        </HeaderRow>
      </HeaderWrapper>
      <AddNewAdv
      // onClose={closeModal}
      />
    </>
  )
}

export default Header
