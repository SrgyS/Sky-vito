import S from './Adv.module.scss'

type Props = { children: string }

const Subtitle = ({ children }: Props) => {
  return <h2 className={S.adv__subtitle}>{children}</h2>
}

export default Subtitle
