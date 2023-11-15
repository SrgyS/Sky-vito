import Button from 'common/buttons/Button'
import S from './Modal.module.scss'
import { IReview } from 'types'
import { useEffect, useState } from 'react'
import {
  useRefreshTokenMutation,
  useUploadCommentMutation,
} from 'store/services/advApi'
import { useAppSelector } from 'hooks/reduxHooks'
import { useParams } from 'react-router-dom'
import { baseUrl } from 'utils/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  commentsData: IReview[]
}

const Reviews = ({ isOpen, onClose, commentsData }: Props) => {
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const { id } = useParams()
  const initialFormData = {
    text: '',
  }
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
    console.log('reset state')
  }
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))

    // setFormError({})
    setIsFormChanged(true)
  }
  const handleUploadComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!access_token || !refresh_token) {
      console.error('Токены не заданы')
      return
    }
    await refreshToken({ access_token, refresh_token })

    const commentData = {
      id,
      formData,
    }
    console.log('comment send', commentData)
    await uploadComment(commentData)
    console.log('upload comment', commentData)
    onClose()
  }
  useEffect(() => {
    if (!isOpen) {
      console.log('reset')
      resetState()
    }
    console.log('after reset', formData)
  }, [isOpen])
  useEffect(() => {
    console.log('review text', formData)
  }, [formData])
  return (
    <div className={isOpen ? `${S.container} ${S.show}` : S.container}>
      <div className={`${S.modal_block} ${S.reviews}`}>
        <h3 className={S.modal_title}>Отзывы о товаре</h3>
        <div className={S.close_btn} onClick={() => onClose()}>
          <div className={S.close_btn_line}></div>
        </div>
        <form
          className={S.form}
          id="formNewArt"
          action="#"
          onSubmit={handleUploadComment}
        >
          <div className={S.form_block}>
            <label htmlFor="text">Добавить отзыв</label>
            <textarea
              className={S.form_textarea}
              name="text"
              cols={10}
              rows={5}
              placeholder="Введите отзыв"
              onChange={handleChange}
              value={formData.text}
            ></textarea>
          </div>
          <Button text="Опубликовать" className="color_btn" />
        </form>

        <div className={S.reviews_block}>
          {commentsData &&
            commentsData.map((comment) => (
              <div key={comment.id} className={S.review_item}>
                <div className={S.review_left}>
                  <div className={S.review_img}>
                    {comment.author.avatar && (
                      <img src={`${baseUrl}/${comment.author.avatar}`} alt="" />
                    )}
                  </div>
                </div>
                <div className={S.review_right}>
                  <p className={S.review_name}>
                    {comment.author.name}
                    <span>{comment.created_on}</span>
                  </p>
                  <h5 className={S.review_title}>Комментарий</h5>
                  <p className={S.review_text}>{comment.text}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Reviews
