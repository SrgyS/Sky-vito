import S from './Search.module.scss'
import { useState } from 'react'
import Button from 'common/buttons/Button'

type Props = { onSearch: (value: string) => void; value: string }

const SearchInput = ({ onSearch, value }: Props) => {
  const [searchValue, setSearchValue] = useState(value)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(searchValue)
  }
  return (
    <form className={S.search} onSubmit={handleSearchClick}>
      <input
        type="search"
        value={searchValue}
        placeholder="Поиск по объявлениям"
        onChange={handleInputChange}
      ></input>
      <Button className="color_btn" text="Найти" />
    </form>
  )
}

export default SearchInput
