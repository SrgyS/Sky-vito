import logoUrl from 'assets/img/Logo54.png'
import S from './Logo.module.scss'

const Logo = () => {
  return <img className={S.logo} src={logoUrl} alt="Logo" />
}

export default Logo
