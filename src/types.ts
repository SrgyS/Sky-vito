import { ThunkDispatch } from '@reduxjs/toolkit'
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers'

export interface IImage {
  id: number
  ad_id: number
  url: string
}

export interface IUser {
  id: number | null | undefined | string
  name?: string
  email: string
  city?: string
  avatar?: string
  sells_from?: string
  phone?: string
}

export interface IAdv {
  title: string
  description: string
  price: number
  id: number
  images: IImage[]
  user_id: number
  created_on: string
  user: IUser
}
export interface IBaseFormData {
  name?: string
  surname?: string
  city?: string
  phone?: string
}
export interface IFormAuthData extends IBaseFormData {
  email: string
  password: string
  repeatPassword?: string
}
export interface IRegistrationError {
  status: number | string
  data:
    | {
        message: string
        details: string
      }
    | unknown
}

export type BaseQueryFn<
  Args = any,
  Result = unknown,
  Error = unknown,
  DefinitionExtraOptions = {},
  Meta = {},
> = (
  args: Args,
  api: BaseQueryApi,
  extraOptions: DefinitionExtraOptions,
) => MaybePromise<QueryReturnValue<Result, Error, Meta>>

export interface BaseQueryApi {
  signal: AbortSignal
  dispatch: ThunkDispatch<any, any, any>
  getState: () => unknown
}

export type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E
      data?: undefined
      meta?: M
    }
  | {
      error?: undefined
      data: T
      meta?: M
    }
