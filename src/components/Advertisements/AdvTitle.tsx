import S from './Adv.module.scss'

type Props = { text: string }

const AdvTitle = ({ text }: Props) => {
  return <h1 className={S.adv__title}>{text}</h1>
}

export default AdvTitle
