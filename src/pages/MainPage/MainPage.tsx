import HeaderWrapper from 'components/Header/HeaderWrapper'
import BlueButton from 'components/buttons/BlueButton'
import HeaderFirstRow from 'components/Header/HeaderFirstRow'
import HeaderRow from 'components/Header/HeaderRow'
import logoUrl from 'assets/img/Logo54.png'
import SearchInput from 'components/Header/Search'

import { IAdv } from 'types'
import { useEffect, useState } from 'react'
import AdvSection from 'components/Advertisements/AdvSection'
import AdvTitle from 'components/Advertisements/AdvTitle'
import AdvContainer from 'components/Advertisements/AdvContainer'
import AdvCard from 'components/Advertisements/AdvCard/AdvCard'
import { useGetAdvQuery } from 'store/services/advApi'
import { validateSearchText } from 'utils/utils'

// type Props = {}

const MainPage = () => {
  const { data, isLoading, error } = useGetAdvQuery({})
  const [dataFiltering, setDataFiltering] = useState(true)

  const [filteredData, setFilteredData] = useState<IAdv[]>([])
  const [displayedData, setDisplayedData] = useState<IAdv[]>([])
  const [searchText, setSearchText] = useState(
    localStorage.getItem('searchText') || '',
  )

  const handleSearch = async (value: string) => {
    const searchText = validateSearchText(value)
    setSearchText(searchText)

    if (searchText) {
      try {
        const filteredData = data?.filter((card: IAdv) => {
          return card.title.toLowerCase().includes(searchText.toLowerCase())
        })
        setFilteredData(filteredData)
        setDataFiltering(false)
      } catch (error) {
        console.error('Ошибка при выполнении поиска:', error)
        setDisplayedData([])
      }
    } else {
      setDisplayedData(data)
    }
    localStorage.setItem('searchText', searchText)
  }

  useEffect(() => {
    const savedSearchText = localStorage.getItem('searchText')
    if (savedSearchText) setSearchText(savedSearchText)
  }, [])

  useEffect(() => {
    if (data) {
      handleSearch(searchText)
      setDataFiltering(false)
    }
  }, [searchText, data])

  useEffect(() => {
    setDisplayedData(filteredData ? filteredData : data)
  }, [data, filteredData])

  return (
    <>
      <HeaderWrapper>
        <HeaderFirstRow>
          <BlueButton text="Вход в личный кабинет" />
        </HeaderFirstRow>
        <HeaderRow>
          <img src={logoUrl} alt="Logo" />
          <SearchInput onSearch={handleSearch} value={searchText} />
        </HeaderRow>
      </HeaderWrapper>
      <AdvSection>
        <AdvTitle text="Объявления" />
        <AdvContainer>
          {isLoading && <p>Загрузка...</p>}
          {!isLoading && error && <p>Что-то пошло не так...</p>}
          {displayedData?.length > 0
            ? displayedData.map((card: IAdv) => (
                <AdvCard
                  title={card.title}
                  key={card.id}
                  price={card.price}
                  city={card.user.city}
                  publicationDate={card.created_on}
                  card={card}
                  images={card.images}
                />
              ))
            : null}
          {!dataFiltering &&
            displayedData?.length === 0 &&
            !isLoading &&
            !error && <p>По запросу ничего не найдено</p>}
        </AdvContainer>
      </AdvSection>
    </>
  )
}

export default MainPage
