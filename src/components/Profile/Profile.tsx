import { IErrorMessage, IFormProfileData } from 'types'
import { IUserState, setUser } from 'store/slices/userSlice'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from 'store/services/advApi'

import Button from 'common/buttons/Button'
import FormError from 'components/Error/FormError'
import { MobileBtnBlack } from 'common/buttons/MobileBtnBlack'
import ProfileImg from './ProfileImg'
import S from './Profile.module.scss'
import S2 from 'components/modals/Modal.module.scss'
import Subtitle from 'components/Advertisements/Subtitle'
import Title from 'components/Advertisements/Title'
import { formatUserDate } from 'utils/utils'
import noAvatarImgUrl from 'assets/img/no-ava.png'
import { useCurrentAdv } from 'hooks/useCurrentAdv'
import { useMobileStatus } from 'hooks/useMobileStatus'

type Props = { user: IUserState }

const Profile = ({ user }: Props) => {
  const initialFormData: IFormProfileData = {
    name: user.name || '',
    surname: user.surname || '',
    city: user.city || '',
    phone: user.phone || '',
    avatarFile: [],
  }

  const initialErrorMessage: IErrorMessage = {
    text: '',
    type: 'error',
  }

  const { id } = useParams()

  const { id: advId } = useCurrentAdv()

  const [isFormChanged, setIsFormChanged] = useState(false)
  const [previewImgUrl, setPreviewImgUrl] = useState('')
  const [errorMessage, setErrorMessage] =
    useState<IErrorMessage>(initialErrorMessage)
  const { access_token, refresh_token } = useAppSelector((state) => state.auth)

  const navigate = useNavigate()
  const { isMobile } = useMobileStatus()

  const [
    updateUser,
    {
      isError: isUpdateUserErrror,
      isSuccess: isUpdateUserSuccess,
      data: updateUserData,
    },
  ] = useUpdateUserMutation()

  const [
    uploadAvatar,
    {
      isSuccess: isUploadAvatarSuccess,
      isError: isUploadAvatarError,
      data: avatarData,
    },
  ] = useUploadAvatarMutation()

  const dispatch = useAppDispatch()
  const location = useLocation()

  if (!id) {
    return <p>Подавец не найден</p>
  }

  const isProfilePage = location.pathname.startsWith('/user/')
  const baseUrl = 'http://localhost:8090'

  const [isPhoneNumberVisible, setIsPhoneNumberVisible] = useState(false)
  const handlePhoneBtnClick = () => {
    setIsPhoneNumberVisible(!isPhoneNumberVisible)
  }
  const sellsFrom =
    user && user.sells_from ? formatUserDate(user.sells_from) : ''

  const handleCancel = () => {
    setValue('avatarFile', [])
    setPreviewImgUrl('')
  }

  //-------------form hook--------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<IFormProfileData>({
    defaultValues: initialFormData,
    mode: 'onBlur',
  })

  const previewAvatar = watch('avatarFile')

  const onSubmit: SubmitHandler<IFormProfileData> = async (data) => {
    if (data.avatarFile) {
      const uploadAvatarFile = data.avatarFile[0]

      await uploadAvatar(uploadAvatarFile)
      setValue('avatarFile', [])
    }
    if (data) {
      const { avatarFile, ...userData } = data

      await updateUser(userData)

      reset({ ...userData, avatarFile: [] })
      setIsFormChanged(false)
    }
  }

  useEffect(() => {
    if (isUpdateUserSuccess) {
      dispatch(setUser(updateUserData))
      reset({ ...watch })
      setErrorMessage({
        text: 'Данные успешно обновлены',
        type: 'success',
      })
      setTimeout(() => {
        setErrorMessage(initialErrorMessage)
      }, 1000)
    }
  }, [isUpdateUserSuccess, updateUserData, user])

  useEffect(() => {
    if (isUploadAvatarSuccess) {
      dispatch(setUser(avatarData))
      setPreviewImgUrl('')
      setIsFormChanged(false)
    }
  }, [isUploadAvatarSuccess])

  useEffect(() => {
    if (previewAvatar) {
      const file = previewAvatar[0]
      file && setPreviewImgUrl(URL.createObjectURL(file))
    }
  }, [previewAvatar])

  useEffect(() => {
    if (isUpdateUserErrror || isUploadAvatarError) {
      setErrorMessage({
        text: 'Произошла ошибка',
        type: 'error',
      })
      setTimeout(() => {
        setErrorMessage(initialErrorMessage)
      }, 1000)
    }
  }, [isUpdateUserErrror, isUploadAvatarError])

  return (
    <div className={S.profile_wrapper}>
      {isProfilePage ? (
        <>
          <Title>
            {user.name ? `Здравствуйте, ${user.name}!` : 'Здравствуйте!'}
          </Title>
          <Subtitle>Настройки профиля</Subtitle>
        </>
      ) : (
        <div className={S2.modal_title_box}>
          <MobileBtnBlack
            onClick={() => {
              navigate(advId === 0 ? '/' : `/ads/${advId}`)
            }}
          />
          <Title>Профиль продавца</Title>
        </div>
      )}
      <div className={S.profile__info}>
        {!(!isProfilePage && isMobile) && (
          <div className={S.img_box}>
            {previewImgUrl ? (
              <ProfileImg src={previewImgUrl} alt="avatar image" />
            ) : user.avatar ? (
              <ProfileImg
                src={`${baseUrl}/${user.avatar}`}
                alt="avatar image"
              />
            ) : (
              <ProfileImg src={noAvatarImgUrl} alt="avatar image" />
            )}
            {isProfilePage && (
              <>
                {previewImgUrl ? (
                  <div className={S.change_img} onClick={handleCancel}>
                    Отменить
                  </div>
                ) : (
                  <label
                    className={S.change_img}
                    htmlFor="fileInput"
                    onClick={() => setErrorMessage(initialErrorMessage)}
                  >
                    Загрузить
                  </label>
                )}
              </>
            )}
          </div>
        )}
        <div className={S.profile__details}>
          {isProfilePage ? (
            <form className={S.profile__form} onSubmit={handleSubmit(onSubmit)}>
              <input
                className={S.hidden_input}
                type="file"
                id="fileInput"
                {...register('avatarFile')}
              />
              <div className={S.form__group}>
                <label htmlFor="name">Имя</label>
                <input
                  type="text"
                  placeholder="Имя"
                  {...register('name', {
                    minLength: {
                      value: 2,
                      message: 'Минимум 2 символа',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Максимально 15 символов',
                    },
                  })}
                />
                {errors.name && (
                  <FormError text={errors.name.message}></FormError>
                )}
              </div>
              <div className={S.form__group}>
                <label htmlFor="surname">Фамилия</label>
                <input
                  type="text"
                  placeholder="Фамилия"
                  {...register('surname', {
                    minLength: {
                      value: 2,
                      message: 'Минимум 2 символа',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Максимально 15 символов',
                    },
                  })}
                />
                {errors.surname && (
                  <FormError text={errors.surname.message}></FormError>
                )}
              </div>
              <div className={S.form__group}>
                <label htmlFor="city">Город</label>
                <input
                  type="text"
                  placeholder="Город"
                  {...register('city', {
                    minLength: {
                      value: 3,
                      message: 'Минимум 3 символа',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Максимально 15 символов',
                    },
                  })}
                />
                {errors.city && (
                  <FormError text={errors.city.message}></FormError>
                )}
              </div>
              <div className={S.form__group}>
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  // pattern="\+7\s?[\(]{0,1}9[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}"

                  placeholder="Телефон"
                  {...register('phone', {
                    minLength: {
                      value: 6,
                      message: 'Минимум 6 цифр',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Максимально 30 цифр',
                    },
                    pattern: {
                      value: /^\+?\d+(\s\d+)*$/,
                      message: 'Недопустимое значение',
                    },
                  })}
                />
                {errors.phone && (
                  <FormError text={errors.phone.message}></FormError>
                )}
                {errorMessage && (
                  <FormError
                    text={errorMessage.text}
                    type={errorMessage.type}
                  ></FormError>
                )}
              </div>
              <Button
                disabled={!isDirty && !isFormChanged}
                type="submit"
                className="color_btn"
                text="Сохранить"
              ></Button>
            </form>
          ) : (
            <>
              <p className={S.profile__name}>{user.name}</p>
              <p className={S.profile__text}>{user.city}</p>
              <p className={S.profile__text}>Продает товары с {sellsFrom}</p>
              {isMobile && (
                <div className={S.img_box}>
                  {previewImgUrl ? (
                    <ProfileImg src={previewImgUrl} alt="avatar image" />
                  ) : user.avatar ? (
                    <ProfileImg
                      src={`${baseUrl}/${user.avatar}`}
                      alt="avatar image"
                    />
                  ) : (
                    <ProfileImg src={noAvatarImgUrl} alt="avatar image" />
                  )}
                  {isProfilePage && (
                    <>
                      {previewImgUrl ? (
                        <div className={S.change_img} onClick={handleCancel}>
                          Отменить
                        </div>
                      ) : (
                        <label
                          className={S.change_img}
                          htmlFor="fileInput"
                          onClick={() => setErrorMessage(initialErrorMessage)}
                        >
                          Загрузить
                        </label>
                      )}
                    </>
                  )}
                </div>
              )}
              {isPhoneNumberVisible && user.phone ? (
                <Button
                  text="телефон"
                  phone={user.phone as string}
                  className="color_btn"
                />
              ) : (
                <Button
                  text={user.phone ? 'Показать телефон' : 'Телефон не указан'}
                  phone={
                    user.phone
                      ? `${(user.phone as string).slice(0, 2)} XXX XXX-XX-XX`
                      : ''
                  }
                  className="color_btn"
                  onClick={() => handlePhoneBtnClick()}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
