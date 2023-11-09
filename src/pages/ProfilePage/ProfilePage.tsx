import { RootState } from 'store/store'
import TopSection from 'common/section/TopSection'
import AdvContainer from 'components/Advertisements/AdvContainer'
import MiniAdvCard from 'components/Advertisements/MiniAdvCard/MiniAdvCard'
import Subtitle from 'components/Advertisements/Subtitle'
import Header from 'components/Header/Header'
import Profile from 'components/Profile/Profile'
import { useGetSellerAdvsQuery } from 'store/services/advApi'
import { IAdv } from 'types'
import { useAppSelector } from 'hooks/reduxHooks'

const ProfilePage = () => {
  const userData = useAppSelector((state: RootState) => state.user)

  const { data, isLoading, error } = useGetSellerAdvsQuery(userData.id)
  if (isLoading) {
    return <p>Загрузка...</p>
  }

  console.log('error', error)
  return (
    <>
      <Header />
      <TopSection>
        {userData.id ? (
          <>
            <Profile user={userData} />
            <Subtitle>Мои товары</Subtitle>
            <AdvContainer>
              {!isLoading && error && <p>Что-то пошло не так...</p>}
              {data.length > 0
                ? data.map((card: IAdv) => (
                    <MiniAdvCard cardData={card} key={card.id} />
                  ))
                : !error && <p>Еще нет ни одного товара</p>}
            </AdvContainer>
          </>
        ) : (
          <p>Пользователь не найден</p>
        )}
      </TopSection>
    </>
  )
}

export default ProfilePage
