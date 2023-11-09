import { formatAdvDate, formatPrice } from 'utils/utils'
import S from './MiniAdvCard.module.scss'
import { IAdv } from 'types'
import { Link } from 'react-router-dom'
import noImgUrl from 'assets/img/no_image.png'
type Props = {
  cardData: IAdv
}

const MiniAdvCard = ({ cardData }: Props) => {
  const date = formatAdvDate(cardData.created_on)
  const baseUrl = 'http://localhost:8090'
  const formatedPrice = formatPrice(cardData.price)

  return (
    <Link to={`/ads/${cardData.id}`}>
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
          <p className={S.card__price}>{formatedPrice} ₽</p>
          <p className={S.card__date}>
            {cardData.user.city}
            <br />
            {date}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default MiniAdvCard
