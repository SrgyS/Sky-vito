import AdvContainer from 'components/Advertisements/AdvContainer'
import CardSkeleton from 'components/CardSkeleton/CardSkeleton'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import { IAdv } from 'types'
import MiniAdvCard from 'components/Advertisements/MiniAdvCard/MiniAdvCard'
import Profile from 'components/Profile/Profile'
import Search from 'components/Search/Search'
import Subtitle from 'components/Advertisements/Subtitle'
import TopSection from 'common/section/TopSection'
import { useAuth } from 'hooks/useAuth'
import { useGetSellerAdvsQuery } from 'store/services/advApi'
import { useMobileStatus } from 'hooks/useMobileStatus'

const ProfilePage = () => {
  const userData = useAuth()

  const { data, isLoading, error, isSuccess } = useGetSellerAdvsQuery(
    userData.id,
  )

  return (
    <>
      <Header />
      <TopSection>
        <Search />

        {userData.id ? (
          <>
            <Profile user={userData} />
            <Subtitle className="advs_title">Мои товары</Subtitle>
            <AdvContainer>
              {!isLoading && error && <p>Что-то пошло не так...</p>}

              {data && data.length > 0
                ? data.map((card: IAdv) => (
                    <MiniAdvCard cardData={card} key={card.id} />
                  ))
                : !error && <p>Еще нет ни одного товара</p>}
            </AdvContainer>
          </>
        ) : (
          isLoading && <div>Загрузка...</div>
        )}
      </TopSection>
      <Footer />
    </>
  )
}

export default ProfilePage
