import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { IAddNewAdv, IAdv, IErrorMessage } from 'types'
import ModalPortal, { PortalTarget } from './ModalPortal'
import {
  useAddAdvMutation,
  useDeleteImgMutation,
  useEditAdvMutation,
  useUploadImgMutation,
} from 'store/services/advApi'
import { useEffect, useState } from 'react'

import Button from 'common/buttons/Button'
import FormError from 'components/Error/FormError'
import { MobileBtnBlack } from 'common/buttons/MobileBtnBlack'
import S from './Modal.module.scss'
import { baseUrl } from 'utils/utils'
import deleteBtnUrl from 'assets/img/delete.png'
import { nanoid } from 'nanoid'
import { useAppSelector } from 'hooks/reduxHooks'
import { useMobileStatus } from 'hooks/useMobileStatus'
import { useRefreshTokenMutation } from 'store/services/advApi'

type Props = {
  isOpen: boolean
  onClose: () => void
  editingAdvData?: IAdv
}

const EditAdv = ({ isOpen, onClose, editingAdvData }: Props) => {
  const { isMobile } = useMobileStatus()

  const initialFormData: IAddNewAdv = editingAdvData || {
    title: '',
    description: '',
    price: '',
    imgFiles: [],
    images: [],
  }
  const initialErrorMessage: IErrorMessage = {
    text: '',
    type: 'error',
  }

  const { access_token, refresh_token } = useAppSelector((state) => state.auth)
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [errorMessage, setErrorMessage] =
    useState<IErrorMessage>(initialErrorMessage)

  const [imgFile, setImgFile] = useState('')

  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

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
  const [addAdv, { isError, isSuccess: isAddAdvSuccess, data }] =
    useAddAdvMutation()

  const [
    editAdv,
    {
      isError: isEditAddAdvError,
      isSuccess: isEditAddAdvSuccess,
      data: isEditAddData,
    },
  ] = useEditAdvMutation()

  const handleImgDelete = async (id: number, imgUrl: string) => {
    if (!access_token || !refresh_token) {
      console.error('Токены не заданы')
      return
    }
    await refreshToken({ access_token, refresh_token })
    await deleteImg({ id, imgUrl })
  }

  useEffect(() => {
    if (isEditAddAdvSuccess) {
      reset({ ...watch })
      setErrorMessage({
        text: 'Данные успешно обновлены',
        type: 'success',
      })
      setTimeout(() => {
        setErrorMessage(initialErrorMessage)
      }, 1000)
    }
  }, [isEditAddAdvSuccess])

  useEffect(() => {
    if (!isOpen) {
      reset()
      setImgFile('')
    }
  }, [isOpen])

  //-------------use Form--------------------------------------------------------

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isDirty },
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
      const editData = {
        title: data.title,
        description: data.description,
        price: data.price,
        id: editingAdvData?.id,
      }

      await editAdv(editData)
    }
    if (data && data.imgFiles && editingAdvData && editingAdvData.id) {
      const uploadImgFile = data.imgFiles[0]
      await uploadImg({ uploadImgFile, id: editingAdvData.id })
    }

    setIsFormChanged(false)
  }

  useEffect(() => {
    if (previewImg) {
      const file = previewImg[0]
      file && setImgFile(URL.createObjectURL(file))
    }
  
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
      setIsFormChanged(false)
    }
  }, [isSubmitSuccessful, reset, isFormChanged])

  useEffect(() => {
    if (isUploadImgSuccess) {
      setIsFormChanged(false)
    }
  }, [isFormChanged])

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
              <h3 className={S.modal_title}>Редактировать</h3>
            </div>
          ) : (
            <h3 className={S.modal_title}>Редактировать объявление</h3>
          )}

          {!isMobile && (
            <div className={S.close_btn} onClick={() => onClose()}>
              <div className={S.close_btn_line}></div>
            </div>
          )}
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
              <div className={S.mobile_scroll}>
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
                  {initialFormData.images &&
                  initialFormData.images.length < 5 ? (
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
              disabled={!isDirty && !isFormChanged}
              text="Сохранить"
            />
            <FormError text={errorMessage.text} type={errorMessage.type} />
          </form>
        </div>
      </div>
    </ModalPortal>
  ) : null
}
export default EditAdv
