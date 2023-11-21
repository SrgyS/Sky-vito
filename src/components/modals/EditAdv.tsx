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
import ModalPortal from './ModalPortal'
import deleteBtnUrl from 'assets/img/delete.png'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import FormError from 'components/Error/FormError'

type Props = {
  isOpen: boolean
  onClose: () => void
  editingAdvData?: IAdv
}

const EditAdv = ({ isOpen, onClose, editingAdvData }: Props) => {
  // type FormChangeHandler =
  //   | React.ChangeEvent<HTMLInputElement>
  //   | React.ChangeEvent<HTMLTextAreaElement>

  // const [formData, setFormData] = useState<IAddNewAdv>(() => {
  //   if (editingAdvData) {
  //     return editingAdvData
  //   }
  //   return initialFormData
  // })
  console.log('editingAdvData', editingAdvData)

  const initialFormData: IAddNewAdv = editingAdvData || {
    title: '',
    description: '',
    price: '',
    imgFiles: [],
    images: [],
  }

  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  // const [sendFile, setSendFile] = useState<File | null>(null)
  const [imgFile, setImgFile] = useState('')
  // const [isFormChanged, setIsFormChanged] = useState(false)

  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  const resetState = () => {
    // setFormData(initialFormData)
    setFormError({})
    // setImgFile(null)
    // setIsFormChanged(false)
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

  // const handleChange = (e: FormChangeHandler) => {
  //   const { name, value } = e.target
  //   setFormData({ ...formData, [name]: value })
  //   setFormError({})
  //   setIsFormChanged(true)
  // }

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files && e.target.files[0]
  //   if (file && file.type.startsWith('image/')) {
  //     // setImgFile(file || null)
  //     setIsFormChanged(true)
  //   } else {
  //     console.error('Выбранный файл не является изображением')
  //   }
  // }
  // const handleEditAdv = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (formData) {
  //     if (!access_token || !refresh_token) {
  //       console.error('Токены не заданы')
  //       return
  //     }
  //     await refreshToken({ access_token, refresh_token })
  //   }
  //   const editData = {
  //     title: formData.title,
  //     description: formData.description,
  //     price: formData.price,
  //     id: editingAdvData?.id,
  //   }
  //   console.log('editAdv', editData)
  //   await editAdv(editData)

  //   if (imgFile && editingAdvData && editingAdvData.id) {
  //     const uploadImgData = { imgFile, id: editingAdvData.id }
  //     console.log('uploadImg', uploadImgData)
  //     await uploadImg(uploadImgData)
  //     // setImgFile(null)
  //   }
  // }

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
    if (!isOpen) {
      resetState()
      reset()
      setImgFile('')
    }
  }, [isOpen])

  //-------------use Form--------------------------------------------------------

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    control,
    reset,
  } = useForm<IAddNewAdv>({
    defaultValues: initialFormData,
    mode: 'onTouched',
  })

  const previewImg = watch('imgFiles')

  const onSubmit: SubmitHandler<IAddNewAdv> = async (data) => {
    if (data) {
      console.log('all data', data)
      if (!access_token || !refresh_token) {
        console.error('Токены не заданы')
        return
      }
      await refreshToken({ access_token, refresh_token })
    }
    const editData = {
      title: data.title,
      description: data.description,
      price: data.price,
      id: editingAdvData?.id,
    }
    console.log('editAdv', editData)
    await editAdv(editData)

    if (data && data.imgFiles && editingAdvData && editingAdvData.id) {
      const uploadImgFile = data.imgFiles[0]
      await uploadImg({ uploadImgFile, id: editingAdvData.id })
    }
  }

  useEffect(() => {
    if (previewImg) {
      const file = previewImg[0]
      file && setImgFile(URL.createObjectURL(file))
    }
    console.log('previewImg', previewImg)
  }, [previewImg])

  useEffect(() => {
    if (editingAdvData) {
      reset(editingAdvData)
    } else {
      reset(initialFormData)
    }
  }, [editingAdvData, reset])
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      setImgFile('')
    }
  }, [isSubmitSuccessful, reset])

  return isOpen ? (
    <ModalPortal>
      <div className={`${S.container} ${S.show}`}>
        <div className={S.modal_block}>
          <h3 className={S.modal_title}>Редактировать объявление</h3>
          <div className={S.close_btn} onClick={() => onClose()}>
            <div className={S.close_btn_line}></div>
          </div>
          <form className={S.form} action="#" onSubmit={handleSubmit(onSubmit)}>
            <div className={S.form_block}>
              <label htmlFor="title">Название</label>
              <input
                className={S.form_input}
                type="text"
                {...register('title', {
                  required: 'Введите название',
                  minLength: {
                    value: 3,
                    message: 'Минимум 3 символа',
                  },
                  maxLength: {
                    value: 40,
                    message: 'Максимально 40 символов',
                  },
                })}
                placeholder="Введите название"
              />
              {errors.title && (
                <FormError text={errors.title.message}></FormError>
              )}
            </div>

            <div className={S.form_block}>
              <label htmlFor="description">Описание</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={S.form_textarea}
                    cols={10}
                    rows={10}
                    placeholder="Введите описание"
                  ></textarea>
                )}
              />
            </div>
            <div className={S.form_block}>
              <p className={S.form_p}>
                Фотографии товара<span>не более 5 фотографий</span>
              </p>
              <div className={S.form_img_bar}>
                {initialFormData.images &&
                  initialFormData.images.map((image) => {
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
                            <div
                              className={S.delete_btn}
                              onClick={() =>
                                editingAdvData?.id !== undefined &&
                                handleImgDelete(editingAdvData?.id, image.url)
                              }
                            >
                              <img src={deleteBtnUrl} alt="delete icon" />
                            </div>
                          </>
                        )}
                      </label>
                    )
                  })}
                {initialFormData.images && initialFormData.images.length < 5 ? (
                  <label htmlFor="fileInput" className={S.form_img}>
                    {imgFile && <img src={imgFile} alt="" />}

                    <div className={S.form_img_cover}></div>
                    <input
                      className={S.hidden}
                      type="file"
                      {...register('imgFiles')}
                      id="fileInput"
                    />
                  </label>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={`${S.form_block} ${S.block_price}`}>
              <label htmlFor="price">Цена</label>
              <div className={S.input_price_box}>
                <input
                  className={S.form_input_price}
                  type="text"
                  id="formEditPrice"
                  {...register('price', {
                    pattern: {
                      value: /^[1-9]\d{0,9}$/,
                      message: 'Недопустимое значение',
                    },
                  })}
                />
                <div className={S.input_price_cover}></div>
              </div>

              {errors.price && (
                <FormError text={errors.price.message}></FormError>
              )}
            </div>

            <Button
              className="color_btn"
              // disabled={!isFormChanged}
              text="Сохранить"
            />
          </form>
        </div>
      </div>
    </ModalPortal>
  ) : null
}
export default EditAdv
