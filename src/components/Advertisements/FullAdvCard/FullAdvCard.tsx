import React, { useEffect, useState } from 'react'
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
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setCurrentAdv } from 'store/slices/advsSlice'
import {
  useDeleteAdvMutation,
  useGetAdvCommentsQuery,
  useRefreshTokenMutation,
} from 'store/services/advApi'
import noImgUrl from 'assets/img/no_image.png'
import Button from 'common/buttons/Button'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import noAvatarImgUrl from 'assets/img/no-ava.png'
import SmallProfileImg from 'components/Profile/SmallProfileImg'
import { useAuth } from 'hooks/useAuth'
import AddNewAdv from 'components/modals/AddNewAdv'

type Props = {
  cardInfo: IAdv
}

const FullAdvCard = ({ cardInfo }: Props) => {
  const { id } = useAuth()
  const { data, isLoading, error } = useGetAdvCommentsQuery(String(cardInfo.id))
  const location = useLocation()
  const date = formatAdvDate(cardInfo.created_on ?? '')
  const sellsFrom = cardInfo.user?.sells_from
    ? formatUserDate(cardInfo.user.sells_from)
    : ''
  const baseUrl = 'http://localhost:8090'
  const formatedPrice = formatPrice(Number(cardInfo.price))

  const [selectedImg, setSelectedImg] = useState(
    cardInfo.images ? cardInfo.images[0]?.url : null,
  )
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()
  const [deleteAdv, { error: deleteAdvError, isSuccess: isDeleteAdvSucccess }] =
    useDeleteAdvMutation()

  const navigate = useNavigate()
  const isUserAdvPage = location.pathname === `/user/ads/${cardInfo.id}`

  const [isPhoneNumberVisible, setIsPhoneNumberVisible] = useState(false)

  const hadleImgClick = (img: IImage) => {
    setSelectedImg(img.url)
  }

  const handleBtnClick = () => {
    setIsPhoneNumberVisible(!isPhoneNumberVisible)
  }

  const handleDeleteAdv = async (cardId: number) => {
    if (!access_token || !refresh_token) {
      console.error('Токены не заданы')
      return
    }
    await refreshToken({ access_token, refresh_token })
    await deleteAdv(cardId)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }
  const reviewCount = data?.length

  useEffect(() => {
    if (isDeleteAdvSucccess) {
      navigate(`/user/${id}`)
    }
  }, [isDeleteAdvSucccess])
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
        <p className={S2.card__date}>{cardInfo.user?.city}</p>
        <p className={S.user_review}>
          {reviewCount === 0
            ? 'Нет отзывов'
            : `${reviewCount}
          ${declineWord(reviewCount)}`}
        </p>
        <p className={S2.card__price}>{formatedPrice} ₽</p>
        {isUserAdvPage && cardInfo.id ? (
          <div className={S.btn_box}>
            <Button
              text="Редактировать"
              className="color_btn"
              onClick={openModal}
            />
            <Button
              text="Снять с публикации"
              onClick={() => {
                if (cardInfo.id !== undefined) {
                  handleDeleteAdv(cardInfo.id)
                } else {
                  console.log('delete error')
                }
              }}
              className={cardInfo.id ? 'color_btn' : 'color_btn disabled'}
            />
          </div>
        ) : isPhoneNumberVisible && cardInfo.user?.phone ? (
          <Button
            text="телефон"
            phone={cardInfo.user.phone}
            className="color_btn"
          />
        ) : (
          <Button
            text={
              cardInfo.user?.phone ? 'Показать телефон' : 'Телефон не указан'
            }
            phone={
              cardInfo.user?.phone
                ? `${cardInfo.user.phone.slice(0, 2)} XXX XXX-XX-XX`
                : ''
            }
            className="color_btn"
            onClick={() => handleBtnClick()}
          />
        )}
        <Link to={`/seller/${cardInfo.user?.id}`}>
          <div className={S.user_info_wrapper}>
            {cardInfo.user?.avatar ? (
              <SmallProfileImg
                src={`${baseUrl}/${cardInfo.user.avatar}`}
                alt="avatar image"
              />
            ) : (
              <SmallProfileImg src={noAvatarImgUrl} alt="avatar image" />
            )}
            <div>
              <p className={S.user_name}>{cardInfo.user?.name}</p>
              <p className={S.user_date}>Продает товары с {sellsFrom}</p>
            </div>
          </div>
        </Link>
      </div>
      <div className={S.description}>
        <h2>Описание товара</h2>
        <p>{cardInfo.description}</p>
      </div>
      <AddNewAdv
        isOpen={isModalOpen}
        onClose={closeModal}
        editingAdvData={cardInfo}
      />
    </AdvWrapper>
  )
}

export default FullAdvCard
