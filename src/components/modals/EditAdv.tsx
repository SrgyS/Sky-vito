import { useEffect, useState } from 'react'
import S from './Modal.module.scss'
import { IAddNewAdv, IAdv } from 'types'
import {
  useAddAdvMutation,
  useDeleteImgMutation,
  useEditAdvMutation,
  useUploadImgMutation,
} from 'store/services/advApi'
import { useAppSelector } from 'hooks/reduxHooks'
import { useRefreshTokenMutation } from 'store/services/advApi'
import Button from 'common/buttons/Button'
import { nanoid } from 'nanoid'
import { baseUrl } from 'utils/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  editingAdvData?: IAdv
}

const EditAdv = ({ isOpen, onClose, editingAdvData }: Props) => {
  type FormChangeHandler =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>

  const initialFormData: IAddNewAdv = {
    title: '',
    description: '',
    price: '',
    imgFiles: [],
    images: [],
  }

  const { access_token, refresh_token } = useAppSelector((state) => state.auth)

  const [imgFile, setImgFile] = useState<File | null>(null)
  const [isFormChanged, setIsFormChanged] = useState(false)

  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  const [formData, setFormData] = useState<IAddNewAdv>(() => {
    if (editingAdvData) {
      return editingAdvData
    }
    return initialFormData
  })
  const resetState = () => {
    setFormData(initialFormData)
    setFormError({})
    setImgFile(null)
    setIsFormChanged(false)
  }

  const [formError, setFormError] = useState({})

  const [
    deleteImg,
    {
      isError: isDeleteImgError,
      isSuccess: isDeleteImgSuccess,
      data: deleteImgData,
    },
  ] = useDeleteImgMutation()

  const [
    uploadImg,
    {
      isError: isUploadImgError,
      isSuccess: isUploadImgSuccess,
      data: UploadImgData,
    },
  ] = useUploadImgMutation()
  const [addAdv, { isError, isSuccess, data }] = useAddAdvMutation()
  const [
    editAdv,
    {
      isError: isEditAddAdvError,
      isSuccess: isEditAddAdvSuccess,
      data: isEditAddData,
    },
  ] = useEditAdvMutation()

  const handleChange = (e: FormChangeHandler) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormError({})
    setIsFormChanged(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImgFile(file || null)
      setIsFormChanged(true)
    } else {
      console.error('Выбранный файл не является изображением')
    }
  }
  const handleEditAdv = async (e: React.FormEvent<HTMLFormElement>) => {
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
    const editData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      id: editingAdvData?.id,
    }
    console.log('editAdv', editData)
    await editAdv(editData)
    if (imgFile && editingAdvData && editingAdvData.id) {
      const uploadImgData = { imgFile, id: editingAdvData.id }
      console.log('uploadImg', uploadImgData)
      await uploadImg(uploadImgData)
      setImgFile(null)
    }
    onClose()
  }

  const handleImgDelete = async (id: number, imgUrl: string) => {
    if (!access_token || !refresh_token) {
      console.error('Токены не заданы')
      return
    }
    await refreshToken({ access_token, refresh_token })
    await deleteImg({ id, imgUrl })
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('addAdvSucces')
    }
  }, [isSuccess])

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, imgFile }))
    console.log('handleFileChange edit', imgFile)
    console.log('formData + img', formData)
  }, [imgFile])

  useEffect(() => {
    console.log('editingAdvData', editingAdvData)
    console.log('картинки', formData.images)

    if (editingAdvData) {
      setFormData((prev) => ({ ...prev, ...editingAdvData }))
      console.log('formData ed', formData)
      console.log('img')
    }
  }, [editingAdvData, isOpen])

  useEffect(() => {
    if (!isOpen) {
      console.log('reset')
      resetState()
    }
  }, [isOpen])

  return (
    <div className={isOpen ? `${S.container} ${S.show}` : S.container}>
      <div className={S.modal_block}>
        <h3 className={S.modal_title}>Редактировать объявление</h3>
        <div className={S.close_btn} onClick={() => onClose()}>
          <div className={S.close_btn_line}></div>
        </div>
        <form className={S.form} action="#" onSubmit={handleEditAdv}>
          <div className={S.form_block}>
            <label htmlFor="title">Название</label>
            <input
              value={formData.title}
              className={S.form_input}
              type="text"
              name="title"
              placeholder="Введите название"
              onChange={handleChange}
            />
          </div>
          <div className={S.form_block}>
            <label htmlFor="description">Описание</label>
            <textarea
              className={S.form_textarea}
              name="description"
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
              {formData.images &&
                formData.images.map((image, index) => {
                  const uniqueId = nanoid()
                  return (
                    <label
                      key={uniqueId}
                      htmlFor={`fileInput-${uniqueId}`}
                      className={S.form_img}
                    >
                      {image && image.url && (
                        <>
                          <img src={`${baseUrl}/${image.url}`} alt="" />
                          <Button
                            text="удалить"
                            className="delete_btn"
                            onClick={() =>
                              editingAdvData?.id !== undefined &&
                              handleImgDelete(editingAdvData?.id, image.url)
                            }
                          />
                        </>
                      )}
                    </label>
                  )
                })}
              {formData.images && formData.images.length < 5 ? (
                <label htmlFor="fileInput" className={S.form_img}>
                  {imgFile && <img src={URL.createObjectURL(imgFile)} alt="" />}

                  <div className={S.form_img_cover}></div>
                  <input
                    className={S.hidden}
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={`${S.form_block} ${S.block_price}`}>
            <label htmlFor="price">Цена</label>
            <input
              className={S.form_input_price}
              type="text"
              name="price"
              id="formEditPrice"
              onChange={handleChange}
              value={formData.price}
            />
            <div className={S.input_price_cover}></div>
          </div>
          <Button
            className="color_btn"
            disabled={!isFormChanged}
            text="Сохранить"
          />
        </form>
      </div>
    </div>
  )
}
export default EditAdv
