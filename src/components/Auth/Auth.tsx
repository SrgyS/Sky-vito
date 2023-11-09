import S from './Auth.module.scss'
import logoUrl from 'assets/img/logo_modal.png'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'common/buttons/Button'
import { useEffect, useState } from 'react'
import { IFormAuthData } from 'types'
import FormError from 'components/Error/FormError'
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from 'store/services/authApi'

import { setTokens } from 'store/slices/authSlice'
import { setUser } from 'store/slices/userSlice'
import { useGetUserQuery } from 'store/services/userApi'
import { useAppDispatch } from 'hooks/reduxHooks'

type FormErrors = {
  [key: string]: string
}

const Auth = () => {
  const initialFormData: IFormAuthData = {
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    surname: '',
    city: '',
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [formData, setFormData] = useState<IFormAuthData>(initialFormData)
  const [formError, setFormError] = useState<FormErrors>({})

  const location = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { email, password } = formData
  const isSignUp = location.pathname === '/signup'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormError({})
  }

  const [
    registerUser,
    {
      isError: isRegisterError,
      isSuccess: isRegisterSuccess,
      status: registerStatus,
      data: registerData,
      error: registerError,
    },
  ] = useRegisterUserMutation()

  const [
    loginUser,
    {
      isError: isLoginError,
      isSuccess: isLoginSuccess,
      status: loginStatus,
      data: loginData,
      error: loginError,
    },
  ] = useLoginUserMutation()

  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading,
  } = useGetUserQuery(null, {
    skip: !isAuthenticated,
  })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const requiredFields = ['email', 'password']
    const errors: FormErrors = {}

    requiredFields.forEach((field) => {
      if (!formData[field as keyof IFormAuthData]) {
        errors[field] = 'Это поле обязательно для заполнения'
      }
    })

    if (Object.keys(errors).length === 0) {
      await loginUser({ email, password })
      setIsAuthenticated(true)
    } else {
      setFormError(errors)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('register')
    const requiredFields = ['email', 'password', 'repeatPassword']
    const errors: FormErrors = {}

    requiredFields.forEach((field) => {
      if (!formData[field as keyof IFormAuthData]) {
        errors[field] = 'Это поле обязательно для заполнения'
      }
    })
    if (formData.password !== formData.repeatPassword) {
      errors['repeatPassword'] = 'Пароли не совпадают'
    }
    if (Object.keys(errors).length === 0) {
      await registerUser(formData)
      await loginUser(formData)
    } else {
      setFormError(errors)
    }
  }

  useEffect(() => {
    if (isLoginSuccess) {
      dispatch(setTokens(loginData))
      setIsAuthenticated(true)
    }
    if (isRegisterSuccess) {
      dispatch(setUser(registerData))
      // navigate(`/`)
    }
  }, [isLoginSuccess, isRegisterSuccess])

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData))
      navigate(`/user/${userData.id}`)
    }
  }, [isAuthenticated, userData])

  return (
    <div className={S.wrapper}>
      <form onSubmit={isSignUp ? handleRegister : handleLogin}>
        <div className={S.logo_wrapper}>
          <img src={logoUrl} alt="logo" />
        </div>
        <input
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        {formError.email && <FormError text={`${formError.email}`} />}
        <input
          type="password"
          placeholder="Пароль"
          name="password"
          onChange={handleChange}
        />
        {formError.password && (
          <FormError text={formError.password}></FormError>
        )}
        {isSignUp && (
          <>
            <input
              type="password"
              placeholder="Повторите пароль"
              name="repeatPassword"
              onChange={handleChange}
            />
            {formError.repeatPassword && (
              <FormError text={formError.repeatPassword}></FormError>
            )}
            <input
              type="text"
              placeholder="Имя (необязательно)"
              name="name"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Фамилия (необязательно)"
              name="surname"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Город (необязательно)"
              name="city"
              onChange={handleChange}
            />
          </>
        )}
        <div>
          <Button
            className="color_btn"
            type="submit"
            text={isSignUp ? 'Зарегистрироваться' : 'Войти'}
          ></Button>
          <Link to="/signup">
            {!isSignUp && (
              <Button
                type="button"
                text="Зарегистрироваться"
                className="signup_btn"
              ></Button>
            )}
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Auth
