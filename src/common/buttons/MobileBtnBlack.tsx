import S from './Button.module.scss'

type Props = { onClick: () => void }

export const MobileBtnBlack = ({ onClick }: Props) => {
  return <div className={S.back_btn_black} onClick={onClick}></div>
}
