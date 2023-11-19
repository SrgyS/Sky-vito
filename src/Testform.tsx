import Button from 'common/buttons/Button'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IFormAuthData } from 'types'

export const testForm = () => {
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
  const repeatPassword = watch('repeatPassword')

  const validatePasswordMatch = (value: string) => {
    return value === password || 'Пароли не совпадают'
  }

  const onSubmit: SubmitHandler<IFormAuthData> = (data) => {
    console.log('form data 2', data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        placeholder="email"
        {...register('email', { required: true })}
      />
      <input
        type="password"
        placeholder="password"
        {...register('password', { required: true })}
      />
      <input
        type="password"
        placeholder="repeat password"
        {...register('repeatPassword', {
          required: 'password required',
          minLength: { value: 8, message: 'min 8 characters required' },
          validate: (value) => value === password || 'not match',
        })}
      />
      {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
      <input type="text" placeholder="name" {...register('name')} />
      <input type="text" placeholder="surname" {...register('surname')} />
      <input type="text" placeholder="city" {...register('city')} />
      <Button text="send" className="color_btn" />
    </form>
  )
}

export default testForm
