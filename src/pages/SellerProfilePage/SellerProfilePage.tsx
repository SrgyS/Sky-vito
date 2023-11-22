import { useParams } from 'react-router-dom'
import AdvContainer from 'components/Advertisements/AdvContainer'
import MiniAdvCard from 'components/Advertisements/MiniAdvCard/MiniAdvCard'
import { IAdv } from 'types'
import { useGetSellerAdvsQuery } from 'store/services/advApi'
import Subtitle from 'components/Advertisements/Subtitle'
import Profile from 'components/Profile/Profile'
import Header from 'components/Header/Header'
import TopSection from 'common/section/TopSection'
import Footer from 'components/Footer/Footer'
import Search from 'components/Search/Search'

const ProfilePage = () => {
  const { id } = useParams()
  if (!id) {
    return <p>Объявление не найдено</p>
  }

  const { data, isLoading, error } = useGetSellerAdvsQuery(id)
  if (isLoading) {
    return <p>Загрузка 123...</p>
  }

  if (!data) {
    return <p>Пользователь не найден</p>
  }

  const userData = data[0]?.user

  return (
    <>
      <Header />
      <TopSection>
        <Search />
        <Profile user={userData} />
        <Subtitle>Товары продавца</Subtitle>
        <AdvContainer>
          {!isLoading && error && <p>Что-то пошло не так...</p>}
          {data?.map((card: IAdv) => (
            <MiniAdvCard cardData={card} key={card.id} />
          ))}
        </AdvContainer>
      </TopSection>
      <Footer />
    </>
  )
}

export default ProfilePage
