import { formatAdvDate, formatPrice } from 'utils/utils'
import S from './MiniAdvCard.module.scss'
import { IAdv } from 'types'
import { Link } from 'react-router-dom'
import noImgUrl from 'assets/img/no_image.png'
import { useAppDispatch } from 'hooks/reduxHooks'
import { setCurrentAdv } from 'store/slices/advsSlice'
import { useAuth } from 'hooks/useAuth'
type Props = {
  cardData: IAdv
}

const MiniAdvCard = ({ cardData }: Props) => {
  const date = formatAdvDate(cardData.created_on ?? '')
  const baseUrl = 'http://localhost:8090'

  const { id } = useAuth()
  const isProfilePage = location.pathname === `/user/${id}`
  const dispatch = useAppDispatch()
  const handleCardClick = () => {
    dispatch(setCurrentAdv(cardData))
  }
  return (
    <Link
      to={isProfilePage ? `/user/ads/${cardData.id}` : `/ads/${cardData.id}`}
      onClick={handleCardClick}
    >
      <div className={S.card}>
        <div className={S.img}>
          {cardData.images && cardData.images.length > 0 ? (
            <img
              src={`${baseUrl}/${cardData.images[0].url}`}
              alt={cardData.title}
            />
          ) : (
            <img src={noImgUrl} alt="no img" />
          )}
        </div>
        <div className={S.card__info}>
          <p className={S.card__title}>{cardData.title}</p>
          <p className={S.card__price}>
            {cardData.price ? formatPrice(cardData.price) : 'Цена не указана'} ₽
          </p>
          <p className={S.card__date}>
            {cardData.user?.city}
            <br />
            {date}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default MiniAdvCard
