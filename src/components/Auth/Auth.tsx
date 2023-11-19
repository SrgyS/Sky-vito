import S from './Auth.module.scss'
import logoUrl from 'assets/img/logo_modal.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'common/buttons/Button'
import { useEffect, useState } from 'react'
import { IErrorResponse, IFormAuthData } from 'types'
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserMutation,
} from 'store/services/advApi'

import { setTokens } from 'store/slices/authSlice'
import { setUser } from 'store/slices/userSlice'

import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import Footer from 'components/Footer/Footer'
import Search from 'components/Search/Search'
import { useMobileStatus } from 'hooks/useMobileStatus'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormError from 'components/Error/FormError'

const Auth = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<IFormAuthData>()
  const isSignUp = location.pathname === '/signup'
  const tokens = useAppSelector((state) => state.auth)

  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormAuthData>({
    defaultValues: {},
    mode: 'onTouched',
  })
  const password = watch('password')
  const email = watch('email')

  const onSubmit: SubmitHandler<IFormAuthData> = (data) => {
    if (!isSignUp) {
      handleLogin(data)
    } else {
      handleRegister(data)
    }

    setFormData(data)
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { isMobile } = useMobileStatus()
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

  const [
    getUser,
    {
      isError: isUserError,
      isSuccess: isUseruccess,

      data: userData,
      error: userError,
    },
  ] = useGetUserMutation()

  const handleLogin = (data: IFormAuthData) => {
    loginUser({ email: data.email, password: data.password })
  }

  const handleRegister = async (data: IFormAuthData) => {
    console.log('register')
    await registerUser(data)
  }

  // useEffect(() => {
  //   if (isLoginError) {
  //     console.log('login error', loginError)
  //   }
  //   if (isLoginSuccess) {
  //     dispatch(setTokens(loginData))
  //     setIsAuthenticated(true)
  //     if (userData) {
  //       console.log('user data', userData)
  //       dispatch(setUser(userData))
  //     }

  //     navigate(`/`)
  //   }
  //   // if (isRegisterSuccess) {
  //   //   dispatch(setUser(registerData))
  //   //   // setIsAuthenticated(true)
  //   // }
  // }, [isLoginSuccess, isRegisterSuccess, userData])

  useEffect(() => {
    if (registerData) {
      setIsAuthenticated(true)
      dispatch(setUser(registerData))
      console.log('user ID', registerData)
      formData &&
        loginUser({ email: formData?.email, password: formData?.password })
      navigate(`/user/${registerData.id}`)
    }
  }, [registerData])

  // useEffect(() => {
  //   if (isRegisterSuccess) {
  //     console.log('user reg', registerData)
  //     dispatch(setUser(registerData))
  //   }
  // }, [isRegisterSuccess])

  useEffect(() => {
    if (isLoginSuccess) {
      setIsAuthenticated(true)

      tokens.access_token && getUser(null)
    }
  }, [isLoginSuccess, tokens])

  useEffect(() => {
    if (userData && loginData) {
      console.log('new user', userData)
      dispatch(setUser(userData))

      navigate(`/user/${userData?.id}`)
    }
  }, [userData, isLoginSuccess, loginData])

  useEffect(() => {
    if (loginError) {
      console.log('user error1', loginError)
      const errorResponse = loginError as IErrorResponse
      console.log('user error2', errorResponse.data.detail)
      if (errorResponse.data.detail === 'Incorrect password') {
        setErrorMessage('Не верный пароль')
      } else {
        setErrorMessage('Такой email не зарегистрирован')
      }
    }
  }, [isLoginError])
  useEffect(() => {
    setErrorMessage('')
  }, [password, email])

  return (
    <>
      {isMobile && <Search />}
      <div className={S.wrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={S.logo_wrapper}>
            <img src={logoUrl} alt="logo" />
          </div>
          <input
            type="email"
            placeholder="email"
            {...register('email', {
              required: 'Введите email',
              // pattern: {
              //   value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              //   message: 'Некорректный email',
              // },
            })}
          />
          {errors.email && <FormError text={errors.email.message}></FormError>}

          <input
            type="password"
            placeholder="Пароль"
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: 6,
                message: 'Минимум 6 символов',
              },
              maxLength: {
                value: 10,
                message: 'Максимально 10 символов',
              },
              // pattern: {
              //   value:
              //     /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
              //   message:
              //     'Должны быть минимум одна заглавная буква, цифра и спецсимвол (!@#$%^&*)',
              // },
            })}
          />
          {errors.password && (
            <FormError text={errors.password.message}></FormError>
          )}

          {isSignUp && (
            <>
              <input
                type="password"
                placeholder="Повторите пароль"
                {...register('repeatPassword', {
                  required: 'Повторите пароль',
                  validate: (value) =>
                    value === password || 'Пароли не совпадают',
                })}
              />
              {errors.repeatPassword && (
                <FormError text={errors.repeatPassword.message}></FormError>
              )}

              <input
                type="text"
                placeholder="Имя (необязательно)"
                {...register('name')}
              />
              {errors.name && (
                <FormError text={errors.name.message}></FormError>
              )}
              <input
                type="text"
                placeholder="Фамилия (необязательно)"
                {...register('surname')}
              />
              {errors.surname && (
                <FormError text={errors.surname.message}></FormError>
              )}
              <input
                type="text"
                placeholder="Город (необязательно)"
                {...register('city')}
              />
              {errors.city && (
                <FormError text={errors.city.message}></FormError>
              )}
            </>
          )}
          <div className={S.form_btn_wrapper}>
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
          {errorMessage && <FormError text={errorMessage}></FormError>}
        </form>
      </div>
      <Footer />
    </>
  )
}

export default Auth
