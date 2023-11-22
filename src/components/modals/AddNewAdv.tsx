import { IAddNewAdv, IErrorMessage, IReview } from 'types'
import ModalPortal, { PortalTarget } from './ModalPortal'
import { useAddAdvMutation, useAddTextAdvMutation } from 'store/services/advApi'
import { useEffect, useState } from 'react'

import Button from 'common/buttons/Button'
import FormError from 'components/Error/FormError'
import { MobileBtnBlack } from 'common/buttons/MobileBtnBlack'
import S from './Modal.module.scss'
import { useMobileStatus } from 'hooks/useMobileStatus'

type Props = {
  isOpen: boolean
  onClose: () => void
}
type FormChangeHandler =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>

const AddNewAdv = ({ isOpen, onClose }: Props) => {
  const { isMobile } = useMobileStatus()

  const initialFormData: IAddNewAdv = {
    title: '',
    description: '',
    price: 0,
    imgFiles: [],
    images: [],
  }

  const initialErrorMessage: IErrorMessage = {
    text: '',
    type: 'error',
  }
  const initialImgFiles: Array<File | null> = Array.from(
    { length: 5 },
    () => null,
  )

  const [errorMessage, setErrorMessage] =
    useState<IErrorMessage>(initialErrorMessage)

  const [isFormChanged, setIsFormChanged] = useState(false)

  const [formData, setFormData] = useState<IAddNewAdv>(initialFormData)

  const [imgFiles, setImgFiles] = useState(initialImgFiles)

  const resetState = () => {
    setFormData(initialFormData)
    setErrorMessage(initialErrorMessage)
    setImgFiles(initialImgFiles)
    setIsFormChanged(false)
  }

  const [addAdv, { isError, isSuccess, data }] = useAddAdvMutation()
  const [
    addTextAdv,
    {
      isError: isAddTextAdvError,
      isSuccess: isAddTextAdvSuccess,
      data: textAdvData,
    },
  ] = useAddTextAdvMutation()

  const handleChange = (e: FormChangeHandler) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setIsFormChanged(true)
    setErrorMessage(initialErrorMessage)
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
      if (!formData.title) {
        setErrorMessage({ text: 'Введите название' })
        return
      }
    }
    if (imgFiles.every((file) => file === null)) {
      await addTextAdv(formData)
    } else {
      await addAdv(formData)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      if (isAddTextAdvSuccess) {
        setErrorMessage({ text: 'Выполнено', type: 'success' })
      }
    }
    if (isAddTextAdvSuccess) {
      if (isAddTextAdvSuccess) {
        setErrorMessage({ text: 'Выполнено 2', type: 'success' })
      }
    }
  }, [isSuccess])

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, imgFiles }))
  }, [imgFiles])

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  useEffect(() => {
    if (isSuccess || isAddTextAdvSuccess) {
      setErrorMessage({ text: 'Выполнено', type: 'success' })
      setTimeout(() => {
        setErrorMessage(initialErrorMessage)
      }, 1000)
    }
    if (isAddTextAdvError || isError) {
      setErrorMessage({ text: 'Произошла ошибка', type: 'error' })
    }
  }, [isAddTextAdvError, isAddTextAdvSuccess, isSuccess, isError])

  return isOpen ? (
    <ModalPortal target={PortalTarget.PORTAL}>
      <div className={`${S.container} ${S.show}`}>
        <div className={S.modal_block}>
          {isMobile ? (
            <div className={S.modal_title_box}>
              <MobileBtnBlack
                onClick={() => {
                  onClose()
                }}
              />
              <h3 className={S.modal_title}>Новое объявление</h3>
            </div>
          ) : (
            <h3 className={S.modal_title}>Новое объявление</h3>
          )}

          {!isMobile && (
            <div className={S.close_btn} onClick={() => onClose()}>
              <div className={S.close_btn_line}></div>
            </div>
          )}
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
            <FormError text={errorMessage.text} type={errorMessage.type} />
          </form>
        </div>
      </div>
    </ModalPortal>
  ) : null
}
export default AddNewAdv
