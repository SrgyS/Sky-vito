import TopSection from 'common/section/TopSection'

import FullAdvCard from 'components/Advertisements/FullAdvCard/FullAdvCard'
import Header from 'components/Header/Header'

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
    console.log(data)
  }, [data])

  return (
    <>
      <Header />
      <TopSection>
        {isLoading && <p>Загрузка...</p>}
        {error && <p>Ошибка загрузки</p>}
        {data && <FullAdvCard cardInfo={data} />}
      </TopSection>
    </>
  )
}

export default AdvPage
