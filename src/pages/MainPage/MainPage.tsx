import { IAdv } from 'types'
import { useEffect, useState } from 'react'
import TopSection from 'common/section/TopSection'
import Title from 'components/Advertisements/Title'
import AdvContainer from 'components/Advertisements/AdvContainer'
import { useGetAllAdvsQuery } from 'store/services/advApi'
import { validateSearchText } from 'utils/utils'

import MiniAdvCard from 'components/Advertisements/MiniAdvCard/MiniAdvCard'

import Header from 'components/Header/Header'

const MainPage = () => {
  const { data, isLoading, error } = useGetAllAdvsQuery({})
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
    console.log(data)
    console.log('filteredData:', filteredData)
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
    setDisplayedData(searchText && filteredData ? filteredData : data)
  }, [data, filteredData])

  return (
    <>
      <Header handleSearch={handleSearch} searchText={searchText} />
      <TopSection>
        <Title>Объявления</Title>
        <AdvContainer>
          {isLoading && <p>Загрузка...</p>}
          {!isLoading && error && <p>Что-то пошло не так...</p>}
          {displayedData?.length > 0
            ? displayedData.map((card: IAdv) => (
                <MiniAdvCard cardData={card} key={card.id} />
              ))
            : null}
          {!dataFiltering &&
            displayedData?.length === 0 &&
            !isLoading &&
            !error && <p>По запросу ничего не найдено</p>}
        </AdvContainer>
      </TopSection>
    </>
  )
}

export default MainPage
