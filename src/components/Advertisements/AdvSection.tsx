import S from './Adv.module.scss'

type Props = {
  children: React.ReactNode
}

const AdvSection = ({ children }: Props) => {
  return <section className={`${S.adv__section} center`}>{children}</section>
}

export default AdvSection
