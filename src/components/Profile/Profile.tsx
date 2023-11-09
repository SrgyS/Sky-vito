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
import { useUpdateUserMutation } from 'store/services/userApi'
import { IBaseFormData } from 'types'

import { useAppDispatch } from 'hooks/reduxHooks'
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

  const dispatch = useAppDispatch()
  if (!id) {
    return <p>Подавец не найден</p>
  }

  const location = useLocation()
  const isProfilePage = location.pathname.startsWith('/user/')

  const baseUrl = 'http://localhost:8090'

  const [isPhoneNumberVisible, setIsPhoneNumberVisible] = useState(false)
  const handleBtnClick = () => {
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
      await updateUser(formData)
      console.log('formData', formData)
    }
  }

  useEffect(() => {
    if (isUpdateUserSuccess) {
      console.log('success')
      console.log('updateUserData', updateUserData)
      dispatch(setUser(updateUserData))
      setIsFormChanged(false)
    }
  }, [isUpdateUserSuccess, updateUserData])

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
          {user.avatar ? (
            <ProfileImg src={`${baseUrl}/${user.avatar}`} alt="avatar image" />
          ) : (
            <ProfileImg src={noAvatarImgUrl} alt="avatar image" />
          )}
          {isProfilePage && <a>Заменить</a>}
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
                  onClick={() => handleBtnClick()}
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
