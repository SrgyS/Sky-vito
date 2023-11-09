import S from './Error.module.scss'

type Props = { text: string }

const FormError = ({ text }: Props) => {
  return <div className={S.error}>{text}</div>
}

export default FormError
