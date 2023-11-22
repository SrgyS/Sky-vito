import S from './TopSection.module.scss'

type Props = { children: React.ReactNode }

const TopSection = ({ children }: Props) => {
  return <section className={S.section}>{children}</section>
}

export default TopSection
