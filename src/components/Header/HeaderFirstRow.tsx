import S from './Header.module.scss'

type Props = { children: React.ReactNode }

const HeaderFirstRow = ({ children }: Props) => {
  return (
    <div className={`${S.header__row} ${S.first__row} center`}>{children}</div>
  )
}

export default HeaderFirstRow
