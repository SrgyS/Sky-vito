import Title from 'components/Advertisements/Title'
import React, { useEffect, useState } from 'react'
import ProfileImg from './ProfileImg'
import S from './Profile.module.scss'
import { formatUserDate } from 'utils/utils'
import { useLocation, useParams } from 'react-router-dom'
import Button from 'common/buttons/Button'
import { IUserState, setUser } from 'store/slices/userSlice'
import Subtitle from 'components/Advertisements/Subtitle'
import noAvatarImgUrl from 'assets/img/no-ava.png'
import {
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useRefreshTokenMutation,
} from 'store/services/advApi'
import { IBaseFormData, IFormAuthData, IFormProfileData } from 'types'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormError from 'components/Error/FormError'

type Props = { user: IUserState }

const Profile = ({ user }: Props) => {
  const [initialFormData, setInitialFormData] = useState<IFormProfileData>({
    name: user.name || '',
    surname: user.surname || '',
    city: user.city || '',
    phone: user.phone || '',
    avatar: null,
  })
  const { id } = useParams()

  // const [formData, setFormData] = useState<IBaseFormData>(initialFormData)
  // const [isFormChanged, setIsFormChanged] = useState(false)
  // const [avatar, setAvatar] = useState<File | null>(null)

  const { access_token, refresh_token } = useAppSelector((state) => state.auth)

  const [
    refreshToken,
    { isError: isRefreshTokenError, isSuccess: isRefreshTokenSuccess },
  ] = useRefreshTokenMutation()

  const [
    updateUser,
    {
      isError: isUpdateUserErrror,
      isSuccess: isUpdateUserSuccess,
      status: updateUserStatus,
      data: updateUserData,
      error: updateUserError,
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

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setFormData({ ...formData, [name]: value })

  //   setIsFormChanged(true)
  // }
  // const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (formData) {
  //     if (!access_token || !refresh_token) {
  //       console.error('Токены не заданы')
  //       return
  //     }
  //     await refreshToken({ access_token, refresh_token })
  //     await updateUser(formData)
  //     console.log('formData', formData)
  //   }
  //   if (avatar) {
  //     await uploadAvatar(avatar)
  //     setAvatar(null)
  //     setIsFormChanged(false)
  //   } else {
  //     console.error('Отсутствует выбранный файл')
  //   }
  // }
  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files && e.target.files[0]
  //   if (file && file.type.startsWith('image/')) {
  //     setAvatar(file || null)
  //     setIsFormChanged(true)
  //   } else {
  //     console.error('Выбранный файл не является изображением')
  //   }
  // }
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

  const onSubmit: SubmitHandler<IFormProfileData> = async (data) => {
    console.log('data 1', data)
    if (data) {
      const { avatar, ...userData } = data
      console.log('new avatar', avatar)
      console.log('new udata', userData)
      if (!access_token || !refresh_token) {
        console.error('Токены не заданы')
        return
      }
      await refreshToken({ access_token, refresh_token })

      !avatar && (await updateUser(userData))
    }

    if (avatar) {
      console.log('avatar send', avatar[0])
      await uploadAvatar(avatar[0])
    }
  }

  const avatar = watch('avatar')

  // ----------------------------------------------------------------
  // useEffect(() => {
  //   setValue('name', user.name || '')
  //   setValue('surname', user.surname || '')
  //   setValue('city', user.city || '')
  //   setValue('phone', user.phone || '')
  // }, [user, setValue])

  useEffect(() => {
    if (isUpdateUserSuccess) {
      dispatch(setUser(updateUserData))
      reset({ ...watch() })
    }
  }, [isUpdateUserSuccess, updateUserData])

  useEffect(() => {
    if (isUploadAvatarSuccess) {
      dispatch(setUser(avatarData))
      setValue('avatar', null)
    }
  }, [isUploadAvatarSuccess])

  // useEffect(() => {
  //   console.log('ava', isUploadAvatarSuccess)
  //   console.log('avadata', avatarData)
  //   dispatch(setUser(avatarData))
  // }, [isUploadAvatarSuccess, avatar])

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
        <Title>Профиль продавца</Title>
      )}
      <div className={S.profile__info}>
        <div className={S.img_box}>
          {avatar ? (
            <ProfileImg
              src={avatar && URL.createObjectURL(avatar[0])}
              alt="avatar image"
            />
          ) : user.avatar ? (
            <ProfileImg src={`${baseUrl}/${user.avatar}`} alt="avatar image" />
          ) : (
            <ProfileImg src={noAvatarImgUrl} alt="avatar image" />
          )}

          {isProfilePage && (
            <>
              <label className={S.change_img} htmlFor="fileInput">
                Загрузить
              </label>
            </>
          )}
        </div>
        <div className={S.profile__details}>
          {isProfilePage ? (
            <form className={S.profile__form} onSubmit={handleSubmit(onSubmit)}>
              <input
                className={S.hidden_input}
                type="file"
                id="fileInput"
                {...register('avatar')}
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
                  // value={formData.name}

                  // onChange={handleChange}
                />
                {errors.name && (
                  <FormError text={errors.name.message}></FormError>
                )}
              </div>
              <div className={S.form__group}>
                <label htmlFor="surname">Фамилия</label>
                <input
                  type="text"
                  // name="surname"
                  // value={formData.surname}
                  placeholder="Фамилия"
                  // onChange={handleChange}
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
                  // name="city"
                  // value={formData.city}
                  placeholder="Город"
                  {...register('city', {
                    minLength: {
                      value: 4,
                      message: 'Минимум 2 символа',
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
                  // name="phone"
                  // value={formData.phone}
                  placeholder="Телефон"
                  // onChange={handleChange}
                  {...register('phone', {
                    minLength: {
                      value: 6,
                      message: 'Минимум 6 цифр',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Максимально 15 цифр',
                    },
                    pattern: {
                      value: /^\+?\d+$/,
                      message: 'допускаются только цифры',
                    },
                  })}
                />
                {errors.phone && (
                  <FormError text={errors.phone.message}></FormError>
                )}
              </div>
              <Button
                disabled={!isDirty}
                // type="submit"
                className="color_btn"
                text="Сохранить"
              ></Button>
            </form>
          ) : (
            <>
              <p className={S.profile__name}>{user.name}</p>
              <p className={S.profile__text}>{user.city}</p>
              <p className={S.profile__text}>Продает товары с {sellsFrom}</p>
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
