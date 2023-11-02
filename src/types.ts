export interface IImage {
  id: number
  ad_id: number
  url: string
}

export interface IUser {
  id: number
  name: string
  email: string
  city: string
  avatar: string
  sells_from: string
  phone: string
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
