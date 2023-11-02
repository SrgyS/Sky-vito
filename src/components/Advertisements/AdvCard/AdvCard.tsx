import { formatDate, formatPrice } from 'utils/utils'
import S from './AdvCard.module.scss'
import { IAdv, IImage } from 'types'

type Props = {
  title: string
  price: number
  city: string
  publicationDate: string
  images?: IImage[]
  card: IAdv
}

const AdvCard = ({ title, price, city, publicationDate, images }: Props) => {
  const date = formatDate(publicationDate)
  const baseUrl = 'http://localhost:8090'
  const formatedPrice = formatPrice(price)

  return (
    <div className={S.card}>
      <div className={S.img}>
        {images !== undefined && images[0]?.url !== undefined && (
          <img src={`${baseUrl}/${images[0]?.url}`} alt={title} />
        )}
      </div>

      <p className={S.card__title}>{title}</p>

      <p className={S.card__price}>{formatedPrice} ₽</p>
      <p className={S.card__date}>{city}</p>
      <p className={S.card__date}>{date}</p>
    </div>
  )
}

export default AdvCard
