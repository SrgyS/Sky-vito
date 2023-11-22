import S from './Button.module.scss'

type Props = { onClick: () => void }

export const MobileBackBtn = ({ onClick }: Props) => {
  return <div className={S.back_btn} onClick={onClick}></div>
}
