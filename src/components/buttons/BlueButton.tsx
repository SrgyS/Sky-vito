import S from './BlueButton.module.scss'

type Props = { text: string }

const BlueButton = ({ text }: Props) => {
  return <button className={S.blueButton}>{text}</button>
}

export default BlueButton
