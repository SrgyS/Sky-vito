import S from './FullAdvCard.module.scss'

type Props = { children: React.ReactNode }

const AdvWrapper = ({ children }: Props) => {
  return <div className={S.wrapper}>{children}</div>
}

export default AdvWrapper
