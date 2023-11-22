import Logo from 'components/Logo/Logo'
import S from './Search.module.scss'
import SearchInput from './SearchInput'
import { Link, useLocation } from 'react-router-dom'
import Button from 'common/buttons/Button'

type Props = { handleSearch?: (value: string) => void; searchText?: string }

const Search = ({ handleSearch, searchText }: Props) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className={S.container}>
      <Logo />
      {isHomePage && handleSearch ? (
        <SearchInput onSearch={handleSearch} value={searchText || ''} />
      ) : (
        <Link to="/">
          <Button text="Вернуться на главную" className="color_btn" />
        </Link>
      )}
    </div>
  )
}

export default Search
