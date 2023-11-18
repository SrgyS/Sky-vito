import TopSection from 'common/section/TopSection'

import FullAdvCard from 'components/Advertisements/FullAdvCard/FullAdvCard'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Search from 'components/Search/Search'

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetAdvByIdQuery } from 'store/services/advApi'

const AdvPage = () => {
  const { id } = useParams()
  if (!id) {
    return <p>Объявление не найдено</p>
  }

  const { data, isLoading, error } = useGetAdvByIdQuery(id)

  useEffect(() => {
    console.log('adv', data)
  }, [data])

  return (
    <>
      <Header />
      <TopSection>
        <Search />
        {isLoading && <p>Загрузка...</p>}
        {error && <p>Ошибка загрузки</p>}
        {data && <FullAdvCard cardInfo={data} />}
      </TopSection>
      <Footer />
    </>
  )
}

export default AdvPage
