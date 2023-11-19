export interface IImage {
  id?: number
  ad_id?: number
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
  description?: string
  price?: number | string
  id?: number
  images?: IImage[]
  user_id?: number
  created_on?: string
  user?: IUser
}
export interface IAddNewAdv {
  title: string
  description?: string
  price?: number | string
  imgFiles?: (File | null)[] | null
  images?: IImage[]
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
export interface IFormProfileData extends IBaseFormData {
  avatar: FileList | null
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

export interface IReview {
  author: IUser
  created_on: string
  id: number
  text: string
}

export interface IErrorResponse {
  status: number
  data: {
    detail: string
  }
}
