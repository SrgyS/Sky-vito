import S from './Adv.module.scss'

type Props = { children: string }

const Title = ({ children }: Props) => {
  return <h1 className={S.adv__title}>{children}</h1>
}

export default Title
