import { IAdv } from 'types'
import { useEffect, useLayoutEffect, useState } from 'react'
import TopSection from 'common/section/TopSection'
import Title from 'components/Advertisements/Title'
import AdvContainer from 'components/Advertisements/AdvContainer'
import { useGetAllAdvsQuery } from 'store/services/advApi'
import { validateSearchText } from 'utils/utils'

import MiniAdvCard from 'components/Advertisements/MiniAdvCard/MiniAdvCard'

import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import Search from 'components/Search/Search'

import CardSkeleton from 'components/CardSkeleton/CardSkeleton'
import { useMobileStatus } from 'hooks/useMobileStatus'

const MainPage = () => {
  const { data, isLoading, error } = useGetAllAdvsQuery({})
  const [dataFiltering, setDataFiltering] = useState(true)
  const { isMobile } = useMobileStatus()
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

  useLayoutEffect(() => {
    setDisplayedData(searchText && filteredData ? filteredData : data)
  }, [data, filteredData])

  return (
    <>
      <Header />

      <TopSection>
        <Search handleSearch={handleSearch} searchText={searchText} />
        <Title className={'main_title'}>Объявления</Title>
        <AdvContainer>
          {!isLoading && error && <p>Что-то пошло не так...</p>}
          {isLoading &&
            [...Array(8)].map((_, index) => (
              <CardSkeleton key={index} isMobile={isMobile} />
            ))}

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
      <Footer />
    </>
  )
}

export default MainPage
