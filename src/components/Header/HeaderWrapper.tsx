import S from './Header.module.scss'

type Props = { children: React.ReactNode }

const HeaderWrapper = ({ children }: Props) => {
  return <div className={S.header__wrapper}>{children}</div>
}

export default HeaderWrapper
