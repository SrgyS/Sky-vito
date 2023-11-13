import { useEffect, useState } from 'react'
import S from './AddNewAdv.module.scss'
import { IAddNewAdv, IAdv } from 'types'
import { useAddAdvMutation } from 'store/services/advApi'
import { useAppSelector } from 'hooks/reduxHooks'
import { useRefreshTokenMutation } from 'store/services/advApi'

type Props = {
  isOpen: boolean
  onClose: () => void
  editingAdvData?: IAdv
}

const AddNewAdv = ({ isOpen, onClose, editingAdvData }: Props) => {
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

  const initialImgFiles: Array<File | null> = Array.from(
    { length: 5 },
    () => null,
  )
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const baseUrl = 'http://localhost:8090'
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
    setImgFiles(initialImgFiles)
  }

  const [formError, setFormError] = useState({})
  const [imgFiles, setImgFiles] = useState(initialImgFiles)

  const [addAdv, { isError, isSuccess, data }] = useAddAdvMutation()

  const handleChange = (e: FormChangeHandler) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormError({})
    console.log(formData)
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    console.log('start')
    const file = e.target.files && e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImgFiles((prevImgFiles) =>
        prevImgFiles.map((imgFile, i) => (i === index ? file : imgFile)),
      )
      console.log('handleFileChange', imgFiles)

      setFormData({ ...formData, imgFiles })
      console.log('formData + img', formData)
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
    console.log('addAdv', formData)
    await addAdv(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('addAdvSucces')
    }
  }, [isSuccess])

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, imgFiles }))
  }, [imgFiles])

  useEffect(() => {
    console.log('editingAdvData', editingAdvData)

    if (editingAdvData) {
      setFormData((prev) => ({ ...prev, ...editingAdvData }))
      console.log('formData ed', formData)
      console.log('img')
    }
  }, [editingAdvData, isOpen])

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  return (
    <div className={isOpen ? `${S.container} ${S.show}` : S.container}>
      <div className={S.modal_block}>
        <h3 className={S.modal_title}>
          {editingAdvData ? 'Редактировать объявление' : 'Новое объявление'}
        </h3>
        <div className={S.close_btn} onClick={() => onClose()}>
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
              {editingAdvData && imgFiles.every((imgFile) => imgFile === null)
                ? formData.images &&
                  formData.images.map((img, index) => (
                    <label
                      key={index}
                      htmlFor={`fileInput-${index}`}
                      className={S.form_img}
                    >
                      <img
                        src={img.url ? `${baseUrl}/${img.url}` : ''}
                        alt=""
                      />
                      <div className={S.form_img_cover}></div>
                      <input
                        className={S.hidden}
                        type="file"
                        id={`fileInput-${index}`}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </label>
                  ))
                : imgFiles.map((imgFile, index) => (
                    <label
                      key={index}
                      htmlFor={`fileInput-${index}`}
                      className={S.form_img}
                    >
                      <img
                        src={imgFile ? URL.createObjectURL(imgFile) : ''}
                        alt=""
                      />
                      <div className={S.form_img_cover}></div>
                      <input
                        className={S.hidden}
                        type="file"
                        id={`fileInput-${index}`}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </label>
                  ))}
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
            />
            <div className={S.input_price_cover}></div>
          </div>
          <button className={S.form_btn_pub} id="btnPublish">
            {editingAdvData ? 'Опубликовать' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default AddNewAdv
