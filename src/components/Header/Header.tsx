import React from 'react'
import HeaderWrapper from './HeaderWrapper'
import HeaderFirstRow from './HeaderFirstRow'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import HeaderRow from './HeaderRow'
import Logo from 'components/Logo/Logo'
import SearchInput from './Search'

import Button from 'common/buttons/Button'
import { useAuth } from 'hooks/useAuth'
import { logout, setUser } from 'store/slices/userSlice'

import { useAppDispatch } from 'hooks/reduxHooks'

type Props = { handleSearch?: (value: string) => void; searchText?: string }

const Header = ({ handleSearch, searchText }: Props) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { isAuth, id } = useAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <HeaderWrapper>
      <HeaderFirstRow>
        {isAuth ? (
          <div>
            <Button text="Разместить объявление" className="header_btn" />
            <Link to={`/user/${id}`}>
              <Button text="Личный кабинет" className="header_btn" />
            </Link>
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
        {isAuth && (
          <Button text="Выйти" className="color_btn" onClick={handleLogout} />
        )}
      </HeaderRow>
    </HeaderWrapper>
  )
}

export default Header
