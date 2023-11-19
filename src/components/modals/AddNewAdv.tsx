import { useEffect, useState } from 'react'
import S from './Modal.module.scss'
import { IAddNewAdv, IAdv } from 'types'
import { useAddAdvMutation, useAddTextAdvMutation } from 'store/services/advApi'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { useRefreshTokenMutation } from 'store/services/advApi'
import Button from 'common/buttons/Button'
import { selectIsOpen } from 'store/selectors/selectors'
import { setCloseModal } from 'store/slices/advsSlice'
import ModalPortal from './ModalPortal'

const AddNewAdv = () => {
  type FormChangeHandler =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsOpen)

  const handleCloseModal = () => {
    dispatch(setCloseModal())
  }

  const initialFormData: IAddNewAdv = {
    title: '',
    description: '',
    price: 0,
    imgFiles: [],
    images: [],
  }

  const initialImgFiles: Array<File | null> = Array.from(
    { length: 5 },
    () => null,
  )
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)

  const [isFormChanged, setIsFormChanged] = useState(false)

  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  const [formData, setFormData] = useState<IAddNewAdv>(initialFormData)
  const resetState = () => {
    setFormData(initialFormData)
    setFormError({})
    setImgFiles(initialImgFiles)
    setIsFormChanged(false)
  }

  const [formError, setFormError] = useState({})
  const [imgFiles, setImgFiles] = useState(initialImgFiles)

  const [addAdv, { isError, isSuccess, data }] = useAddAdvMutation()
  const [
    addTextAdv,
    {
      isError: isAddTextAdvError,
      isSuccess: isAddTextAdvSuccess,
      data: addTextAdvData,
    },
  ] = useAddTextAdvMutation()

  const handleChange = (e: FormChangeHandler) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setIsFormChanged(true)
    setFormError({})
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files && e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImgFiles((prevImgFiles) =>
        prevImgFiles.map((imgFile, i) => (i === index ? file : imgFile)),
      )
      setIsFormChanged(true)
    } else {
      console.error('Выбранный файл не является изображением')
    }
  }

  const handleAddAdv = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData) {
      if (!access_token || !refresh_token) {
        console.error('Токены не заданы')
        return
      }
      await refreshToken({ access_token, refresh_token })
      if (!formData.title) {
        setFormError('Это поле обязательно для заполнения')
        console.log('заполни поле')
        return
      }
    }
    if (imgFiles.every((file) => file === null)) {
      await addTextAdv(formData)
      console.log('addTextAdv', formData)
    } else {
      console.log('addAdv', formData)
      await addAdv(formData)
    }
    resetState()
    // onClose()
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('addAdvSucces')
    }
    if (isAddTextAdvSuccess) {
      console.log('addAdvTextSucces')
    }
  }, [isSuccess])

  useEffect(() => {
    console.log('add imgFiles', imgFiles)
    setFormData((prevFormData) => ({ ...prevFormData, imgFiles }))
  }, [imgFiles])

  useEffect(() => {
    if (!isOpen) {
      console.log('reset')
      resetState()
    }
  }, [isOpen])

  return isOpen ? (
    <ModalPortal>
      <div className={`${S.container} ${S.show}`}>
        <div className={S.modal_block}>
          <h3 className={S.modal_title}>Новое объявление</h3>
          <div className={S.close_btn} onClick={handleCloseModal}>
            <div className={S.close_btn_line}></div>
          </div>
          <form
            className={S.form}
            id="formNewArt"
            action="#"
            onSubmit={handleAddAdv}
          >
            <div className={S.form_block}>
              <label htmlFor="title">Название</label>
              <input
                value={formData.title}
                className={S.form_input}
                type="text"
                name="title"
                id="formName"
                placeholder="Введите название"
                onChange={handleChange}
              />
            </div>
            <div className={S.form_block}>
              <label htmlFor="description">Описание</label>
              <textarea
                className={S.form_textarea}
                name="description"
                id="formArea"
                cols={10}
                rows={10}
                placeholder="Введите описание"
                onChange={handleChange}
                value={formData.description}
              ></textarea>
            </div>
            <div className={S.form_block}>
              <p className={S.form_p}>
                Фотографии товара<span>не более 5 фотографий</span>
              </p>
              <div className={S.form_img_bar}>
                {imgFiles.map((imgFile, index) => {
                  const uniqueId = `modal2-${index}`
                  return (
                    <label
                      key={uniqueId}
                      htmlFor={`fileInput-${uniqueId}`}
                      className={S.form_img}
                    >
                      {imgFile && (
                        <img src={URL.createObjectURL(imgFile)} alt="" />
                      )}

                      <div className={S.form_img_cover}></div>
                      <input
                        className={S.hidden}
                        type="file"
                        id={`fileInput-${uniqueId}`}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
            <div className={`${S.form_block} ${S.block_price}`}>
              <label htmlFor="price">Цена</label>
              <input
                className={S.form_input_price}
                type="text"
                name="price"
                id="formName"
                onChange={handleChange}
                value={formData.price}
              />
              <div className={S.input_price_cover}></div>
            </div>
            <Button
              className="color_btn"
              text="Опубликовать"
              disabled={!isFormChanged}
            />
          </form>
        </div>
      </div>
    </ModalPortal>
  ) : null
}
export default AddNewAdv
