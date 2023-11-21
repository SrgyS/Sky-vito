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
import { useEffect, useLayoutEffect } from 'react'
import Footer from 'components/Footer/Footer'
import Search from 'components/Search/Search'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'
import CardSkeleton from 'components/CardSkeleton/CardSkeleton'
import { useMobileStatus } from 'hooks/useMobileStatus'

const ProfilePage = () => {
  const userData = useAuth()
  // const { id } = useParams()
  // const navigate = useNavigate()
  const { isMobile } = useMobileStatus()
  const userFromStorage = localStorage.getItem('user')
  const userId = userFromStorage && JSON.parse(userFromStorage).id
  // if (id !== userId.toString()) {
  //   navigate('/')
  // }
  const { data, isLoading, error, isSuccess } = useGetSellerAdvsQuery(
    userData.id,
  )
  // if (isLoading) {
  //   return <p>Загрузка ---...</p>
  // }

  // useEffect(() => {
  //   if (id !== userId.toString()) {
  //     navigate('/')
  //   }
  // }, [id])

  return (
    <>
      <Header />
      <TopSection>
        <Search />
        {isLoading &&
          [...Array(1)].map((_, index) => (
            <CardSkeleton key={index} isMobile={isMobile} />
          ))}
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
          ''
        )}
      </TopSection>
      <Footer />
    </>
  )
}

export default ProfilePage
