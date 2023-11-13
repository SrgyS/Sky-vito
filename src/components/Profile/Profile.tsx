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
import { IBaseFormData } from 'types'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'

type Props = { user: IUserState }

const Profile = ({ user }: Props) => {
  const initialFormData: IBaseFormData = {
    name: user.name || '',
    surname: user.surname || '',
    city: user.city || '',
    phone: user.phone || '',
  }
  const { id } = useParams()

  const [formData, setFormData] = useState<IBaseFormData>(initialFormData)
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    setIsFormChanged(true)
  }
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData) {
      if (!access_token || !refresh_token) {
        console.error('Токены не заданы')
        return
      }
      await refreshToken({ access_token, refresh_token })
      await updateUser(formData)
      console.log('formData', formData)
    }
    if (avatar) {
      const formData = new FormData()
      formData.append('file', avatar)
      await uploadAvatar(formData)
      setAvatar(null)
      setIsFormChanged(false)
    } else {
      console.error('Отсутствует выбранный файл')
    }
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setAvatar(file || null)
      setIsFormChanged(true)
    } else {
      console.error('Выбранный файл не является изображением')
    }
  }

  // const handleUploadAvatar = async () => {
  //   if (!access_token || !refresh_token) {
  //     console.error('Токены не заданы')
  //     return
  //   }
  //   await refreshToken({ access_token, refresh_token })
  //   const formData = new FormData()
  //   if (avatar) {
  //     formData.append('file', avatar)
  //     await uploadAvatar(formData)
  //     setAvatar(null)
  //     setIsFormChanged(false)
  //   } else {
  //     console.error('Отсутствует выбранный файл')
  //   }
  // }

  useEffect(() => {
    if (isUpdateUserSuccess) {
      console.log('success')
      console.log('updateUserData', updateUserData)
      dispatch(setUser(updateUserData))
      setIsFormChanged(false)
    }
  }, [isUpdateUserSuccess, updateUserData])

  useEffect(() => {
    console.log('ava', isUploadAvatarSuccess)
    console.log('avadata', avatarData)
    dispatch(setUser(avatarData))
  }, [isUploadAvatarSuccess, avatar])

  return (
    <div>
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
            <ProfileImg src={URL.createObjectURL(avatar)} alt="avatar image" />
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
              <input
                className={S.hidden_input}
                type="file"
                id="fileInput"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
        <div className={S.profile__details}>
          {isProfilePage ? (
            <form className={S.profile__form} onSubmit={handleUpdateUser}>
              <div className={S.form__group}>
                <label htmlFor="name">Имя</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Имя"
                  onChange={handleChange}
                />
              </div>
              <div className={S.form__group}>
                <label htmlFor="lname">Фамилия</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  placeholder="Фамилия"
                  onChange={handleChange}
                />
              </div>
              <div className={S.form__group}>
                <label htmlFor="city">Город</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  placeholder="Город"
                  onChange={handleChange}
                />
              </div>
              <div className={S.form__group}>
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  // pattern="\+7\s?[\(]{0,1}9[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}"
                  name="phone"
                  value={formData.phone}
                  placeholder="Телефон"
                  onChange={handleChange}
                />
              </div>
              <Button
                disabled={!isFormChanged}
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
