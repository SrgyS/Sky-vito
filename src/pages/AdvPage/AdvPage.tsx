import TopSection from 'common/section/TopSection'

import FullAdvCard from 'components/Advertisements/FullAdvCard/FullAdvCard'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Search from 'components/Search/Search'
import Slider from 'components/Slider/Slider'
import { useAppDispatch } from 'hooks/reduxHooks'
import { useMobileStatus } from 'hooks/useMobileStatus'

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetAdvByIdQuery } from 'store/services/advApi'
import { setCurrentAdv } from 'store/slices/advsSlice'

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
    console.log('adv', advData)
  }, [advData])

  return (
    <>
      <Header />
      {isMobile && <Slider images={advData?.images} />}
      <TopSection>
        <Search />
        {isAdvLoading && <p>Загрузка...</p>}
        {advError && <p>Ошибка загрузки</p>}
        {advData && <FullAdvCard cardInfo={advData} />}
      </TopSection>
      <Footer />
    </>
  )
}

export default AdvPage
