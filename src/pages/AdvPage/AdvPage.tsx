import Footer from 'components/Footer/Footer'
import FullAdvCard from 'components/Advertisements/FullAdvCard/FullAdvCard'
import Header from 'components/Header/Header'
import Search from 'components/Search/Search'
import Slider from 'components/Slider/Slider'
import TopSection from 'common/section/TopSection'
import { setCurrentAdv } from 'store/slices/advsSlice'
import { useAppDispatch } from 'hooks/reduxHooks'
import { useEffect } from 'react'
import { useGetAdvByIdQuery } from 'store/services/advApi'
import { useMobileStatus } from 'hooks/useMobileStatus'
import { useParams } from 'react-router-dom'

const AdvPage = () => {
  const { id } = useParams()
  if (!id) {
    return <p>Объявление не найдено</p>
  }
  const dispatch = useAppDispatch()
  const {
    data: advData,
    isLoading: isAdvLoading,
    error: advError,
  } = useGetAdvByIdQuery(id)

  const { isMobile } = useMobileStatus()

  useEffect(() => {
    if (advData) {
      dispatch(setCurrentAdv(advData))
    }
  }, [advData])

  return (
    <>
      <Header />
      {isMobile && <Slider images={advData?.images} />}
      <TopSection>
        <Search />
        {isAdvLoading && <p>Загрузка идет...</p>}
        {advError && <p>Ошибка загрузки</p>}
        {advData && <FullAdvCard cardInfo={advData} />}
      </TopSection>
      <Footer />
    </>
  )
}

export default AdvPage
