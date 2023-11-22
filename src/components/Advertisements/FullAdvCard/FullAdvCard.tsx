import { IAdv, IImage } from 'types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  declineWord,
  formatAdvDate,
  formatPrice,
  formatUserDate,
} from 'utils/utils'
import {
  setCloseModal,
  setCurrentAdv,
  setOpenModal,
} from 'store/slices/advsSlice'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import {
  useDeleteAdvMutation,
  useGetAdvCommentsQuery,
  useRefreshTokenMutation,
} from 'store/services/advApi'

import AdvWrapper from './AdvWrapper'
import BigImg from './BigImg'
import Button from 'common/buttons/Button'
import EditAdv from 'components/modals/EditAdv'
import Reviews from 'components/modals/Reviews'
import S from '../FullAdvCard/FullAdvCard.module.scss'
import SmallImg from './SmallImg'
import SmallProfileImg from 'components/Profile/SmallProfileImg'
import noAvatarImgUrl from 'assets/img/no-ava.png'
import noImgUrl from 'assets/img/no_img.png'
import { useAuth } from 'hooks/useAuth'
import { useMobileStatus } from 'hooks/useMobileStatus'

type Props = {
  cardInfo: IAdv
}

const FullAdvCard = ({ cardInfo }: Props) => {
  const { id } = useAuth()
  const { isMobile } = useMobileStatus()
  const dispatch = useAppDispatch()
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    isSuccess: isCommentsSuccess,
  } = useGetAdvCommentsQuery(String(cardInfo.id))
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
  const { isOpenModal } = useAppSelector((state) => state.advs)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

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
    await deleteAdv(cardId)
  }

  const openEditModal = () => {
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  const openReviewModal = () => {
    setIsReviewModalOpen(true)
    dispatch(setOpenModal())
  }
  const closeReviewModal = () => {
    setIsReviewModalOpen(false)
    dispatch(setCloseModal())
  }
  const reviewCount = commentsData?.length

  useEffect(() => {
    if (isDeleteAdvSucccess) {
      navigate(`/user/${id}`)
    }
  }, [isDeleteAdvSucccess])

  useEffect(() => {
    if (cardInfo.images && cardInfo.images.length > 0) {
      setSelectedImg(cardInfo.images[0].url)
    }
  }, [cardInfo.images])

  return (
    <>
      {!(isOpenModal && isMobile) && (
        <AdvWrapper>
          {!isMobile && (
            <div className={S.img_wrapper}>
              {cardInfo.images && cardInfo.images.length > 0 ? (
                <BigImg
                  src={`${baseUrl}/${selectedImg}`}
                  alt={cardInfo.title}
                />
              ) : (
                <div className={S.no_img}>
                  <BigImg src={noImgUrl} alt="no image" />
                </div>
              )}
              <div className={S.small_img_wrapper}>
                {cardInfo.images?.map((img) => (
                  <SmallImg
                    src={`${baseUrl}/${img.url}`}
                    alt={cardInfo.title}
                    key={img.id}
                    onClick={() => hadleImgClick(img)}
                    selected={
                      selectedImg === img.url ? S.small_img_selected : ''
                    }
                  />
                ))}
              </div>
            </div>
          )}
          <div>
            <h1>{cardInfo.title}</h1>
            <p className={S.info_date}>{date}</p>
            <p className={S.info_city}>{cardInfo.user?.city}</p>
            <p className={S.user_review} onClick={() => openReviewModal()}>
              {reviewCount === 0
                ? 'Нет отзывов'
                : `${reviewCount}
      ${declineWord(reviewCount)}`}
            </p>
            <p className={S.info_price}>
              {Number(formatedPrice) === 0
                ? 'Цена не указана'
                : `${formatedPrice}`}{' '}
              ₽
            </p>
            {isUserAdvPage && cardInfo.id ? (
              <div className={S.btn_box}>
                <Button
                  text="Редактировать"
                  className="color_btn"
                  onClick={openEditModal}
                />
                <Button
                  text="Снять с публикации"
                  onClick={async () => {
                    if (cardInfo.id !== undefined) {
                      await handleDeleteAdv(cardInfo.id)
                      dispatch(setCurrentAdv(null))
                      navigate(`/user/${id}`)
                    } else {
                      console.error('delete error')
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
                  cardInfo.user?.phone
                    ? 'Показать телефон'
                    : 'Телефон не указан'
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
          <EditAdv
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            editingAdvData={cardInfo}
          />
        </AdvWrapper>
      )}
      <Reviews
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        commentsData={commentsData}
      />
    </>
  )
}

export default FullAdvCard
