import S from './Adv.module.scss'

type Props = { children: React.ReactNode }

const AdvContainer = ({ children }: Props) => {
  return <div className={S.adv__container}>{children}</div>
}

export default AdvContainer
