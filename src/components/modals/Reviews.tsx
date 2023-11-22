import { Link, useParams } from 'react-router-dom'
import ModalPortal, { PortalTarget } from './ModalPortal'
import { baseUrl, formatReviewDate } from 'utils/utils'
import { useEffect, useState } from 'react'
import {
  useRefreshTokenMutation,
  useUploadCommentMutation,
} from 'store/services/advApi'

import Button from 'common/buttons/Button'
import FormError from 'components/Error/FormError'
import { IReview } from 'types'
import { MobileBackBtn } from 'common/buttons/MobileBtnWhite'
import { MobileBtnBlack } from 'common/buttons/MobileBtnBlack'
import S from './Modal.module.scss'
import deleteIconUrl from 'assets/img/delete.png'
import { selectCurrentAdv } from 'store/selectors/selectors'
import { setCloseModal } from 'store/slices/advsSlice'
import { useAppSelector } from 'hooks/reduxHooks'
import { useAuth } from 'hooks/useAuth'
import { useMobileStatus } from 'hooks/useMobileStatus'
type Props = {
  isOpen: boolean
  onClose: () => void
  commentsData: IReview[]
}

const Reviews = ({ isOpen, onClose, commentsData }: Props) => {
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const currentAdv = useAppSelector(selectCurrentAdv)

  const { isAuth, id } = useAuth()
  const { isMobile } = useMobileStatus()
  const initialFormData = {
    text: '',
  }
  const [errorMessage, setErrorMessage] = useState('')
  const [
    uploadComment,
    { isSuccess: isUploadCommentSuccess, isError: isUploadCommentError },
  ] = useUploadCommentMutation()
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  const resetState = () => {
    setFormData(initialFormData)
    setIsFormChanged(false)
  }
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))

    formData.text.trim().length < 3
      ? setErrorMessage('Минимум 4 символа')
      : (setIsFormChanged(true), setErrorMessage(''))
  }
  const handleUploadComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!access_token || !refresh_token) {
      console.error('Токены не заданы')
      return
    }
    await refreshToken({ access_token, refresh_token })

    if (currentAdv) {
      const commentData = {
        id: currentAdv.id,
        formData,
      }

      await uploadComment(commentData)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  useEffect(() => {
    if (isUploadCommentSuccess) {
      resetState()
    }
  }, [isUploadCommentSuccess])

  useEffect(() => {
    if (formData.text.trim() === '' && formData.text.trim().length < 4) {
      setIsFormChanged(false)
    }
  }, [formData])

  return isOpen ? (
    <ModalPortal target={PortalTarget.PORTAL}>
      <div className={`${S.container} ${S.show}`}>
        <div className={`${S.modal_block} ${S.reviews}`}>
          <div className={S.modal_title_box}>
            <MobileBtnBlack
              onClick={() => {
                onClose()
              }}
            />
            <h3 className={S.modal_title}>Отзывы о товаре</h3>
          </div>
          {!isMobile && (
            <div className={S.close_btn} onClick={() => onClose()}>
              <div className={S.close_btn_line}></div>
            </div>
          )}
          <form
            className={S.form}
            id="formNewArt"
            action="#"
            onSubmit={handleUploadComment}
          >
            <div className={S.form_block}>
              {!isMobile && <label htmlFor="text">Добавить отзыв</label>}
              <textarea
                className={`${S.form_textarea} ${S.review_textarea}`}
                name="text"
                cols={5}
                rows={5}
                placeholder="Введите отзыв"
                onChange={handleChange}
                value={formData.text}
              ></textarea>
              <FormError text={errorMessage} />
            </div>
            <Button
              text="Опубликовать"
              className="color_btn"
              disabled={!isAuth || !isFormChanged}
            />
          </form>

          <div className={S.reviews_block}>
            {commentsData &&
              commentsData.map((comment) => (
                <div key={comment.id} className={S.review_item}>
                  <div className={S.review_left}>
                    <Link
                      to={`/seller/${comment.author?.id}`}
                      onClick={() => onClose()}
                    >
                      <div className={S.review_img}>
                        {comment.author.avatar && (
                          <img
                            src={`${baseUrl}/${comment.author.avatar}`}
                            alt=""
                          />
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className={S.review_right}>
                    <p className={S.review_name}>
                      {comment.author.name}
                      <span>{formatReviewDate(comment.created_on)}</span>
                    </p>
                    <h5 className={S.review_title}>Комментарий</h5>
                    <p className={S.review_text}>{comment.text}</p>
                    {comment.author.id === Number(id) && (
                      <div
                        className={S.review_delete_btn}
                        onClick={() => alert('Функционал пока не реализован')}
                      >
                        <img src={deleteIconUrl} alt="delete icon" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </ModalPortal>
  ) : null
}

export default Reviews
