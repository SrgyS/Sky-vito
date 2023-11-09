import React, { useState } from 'react'
import AdvWrapper from './AdvWrapper'
import { IAdv, IImage } from 'types'
import {
  declineWord,
  formatAdvDate,
  formatPrice,
  formatUserDate,
} from 'utils/utils'
import BigImg from './BigImg'
import SmallImg from './SmallImg'
import S from '../FullAdvCard/FullAdvCard.module.scss'
import S2 from '../MiniAdvCard/MiniAdvCard.module.scss'
import { Link } from 'react-router-dom'
import { setCurrentAdv } from 'store/slices/advsSlice'
import { useGetAdvCommentsQuery } from 'store/services/advApi'
import noImgUrl from 'assets/img/no_image.png'
import Button from 'common/buttons/Button'
import { useAppDispatch } from 'hooks/reduxHooks'

type Props = {
  cardInfo: IAdv
}

const FullAdvCard = ({ cardInfo }: Props) => {
  const { data, isLoading, error } = useGetAdvCommentsQuery(String(cardInfo.id))

  const date = formatAdvDate(cardInfo.created_on)
  const sellsFrom = cardInfo.user.sells_from
    ? formatUserDate(cardInfo.user.sells_from)
    : ''
  const baseUrl = 'http://localhost:8090'
  const formatedPrice = formatPrice(cardInfo.price)
  const dispatch = useAppDispatch()
  const [selectedImg, setSelectedImg] = useState(
    cardInfo.images ? cardInfo.images[0]?.url : null,
  )

  const [isPhoneNumberVisible, setIsPhoneNumberVisible] = useState(false)

  const hadleImgClick = (img: IImage) => {
    setSelectedImg(img.url)
  }

  const handleProfileClick = () => {
    dispatch(setCurrentAdv(cardInfo))
  }
  const handleBtnClick = () => {
    setIsPhoneNumberVisible(!isPhoneNumberVisible)
  }

  const reviewCount = data?.length

  return (
    <AdvWrapper>
      <div className={S.img_wrapper}>
        {cardInfo.images && cardInfo.images.length > 0 ? (
          <BigImg src={`${baseUrl}/${selectedImg}`} alt={cardInfo.title} />
        ) : (
          <BigImg src={noImgUrl} alt="no image" />
        )}
        <div className={S.small_img_wrapper}>
          {cardInfo.images?.map((img) => (
            <SmallImg
              src={`${baseUrl}/${img.url}`}
              alt={cardInfo.title}
              key={img.id}
              onClick={() => hadleImgClick(img)}
              selected={selectedImg === img.url ? S.small_img_selected : ''}
            />
          ))}
        </div>
      </div>
      <div>
        <h1>{cardInfo.title}</h1>
        <p className={S2.card__date}>{date}</p>
        <p className={S2.card__date}>{cardInfo.user.city}</p>
        <p className={S.user_review}>
          {reviewCount === 0
            ? 'Нет отзывов'
            : `${reviewCount}
          ${declineWord(reviewCount)}`}
        </p>
        <p className={S2.card__price}>{formatedPrice} ₽</p>
        {isPhoneNumberVisible && cardInfo.user.phone ? (
          <Button
            text="телефон"
            phone={cardInfo.user.phone}
            className="color_btn"
          />
        ) : (
          <Button
            text={
              cardInfo.user.phone ? 'Показать телефон' : 'Телефон не указан'
            }
            phone={
              cardInfo.user.phone
                ? `${cardInfo.user.phone.slice(0, 2)} XXX XXX-XX-XX`
                : ''
            }
            className="color_btn"
            onClick={() => handleBtnClick()}
          />
        )}
        <Link to={`/seller/${cardInfo.user.id}`} onClick={handleProfileClick}>
          <div className={S.user_info_wrapper}>
            <div className={S.user_img}>
              <img src="" alt="" />
            </div>
            <div>
              <p className={S.user_name}>{cardInfo.user.name}</p>
              <p className={S.user_date}>Продает товары с {sellsFrom}</p>
            </div>
          </div>
        </Link>
      </div>
      <div className={S.description}>
        <h2>Описание товара</h2>
        <p>{cardInfo.description}</p>
      </div>
    </AdvWrapper>
  )
}

export default FullAdvCard
