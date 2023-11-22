import S from './Header.module.scss'

type Props = { children: React.ReactNode }

const HeaderContainer = ({ children }: Props) => {
  return (
    <div className={`${S.header_container} center`}>
      <div className={S.header_content}>{children}</div>
    </div>
  )
}

export default HeaderContainer
