import Footer from 'components/Footer/Footer'
import FullAdvCard from 'components/Advertisements/FullAdvCard/FullAdvCard'
import Header from 'components/Header/Header'
import Search from 'components/Search/Search'
import TopSection from 'common/section/TopSection'
import { useEffect } from 'react'
import { useGetAdvByIdQuery } from 'store/services/advApi'
import { useParams } from 'react-router-dom'

const AdvPage = () => {
  const { id } = useParams()
  if (!id) {
    return <p>Объявление не найдено</p>
  }

  const { data, isLoading, error } = useGetAdvByIdQuery(id)

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
