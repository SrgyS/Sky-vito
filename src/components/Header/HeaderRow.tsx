import S from './Header.module.scss'

type Props = { children: React.ReactNode }

const HeaderRow = ({ children }: Props) => {
  return <div className={`${S.header__row} center`}>{children}</div>
}

export default HeaderRow
