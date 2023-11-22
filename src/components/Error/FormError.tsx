import S from './Error.module.scss'

type Props = { text: string | undefined; type?: 'error' | 'success' }

const FormError = ({ text, type = 'error' }: Props) => {
  const className = type === 'success' ? `${S.success}` : `${S.error}`
  return <div className={className}>{text}</div>
}

export default FormError
