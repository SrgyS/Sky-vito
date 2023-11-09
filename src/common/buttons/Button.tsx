import S from './Button.module.scss'

type Props = {
  text: string
  phone?: string | null
  onClick?: () => void
  type?: string
  className?: string
  disabled?: boolean
}

const Button = ({ text, phone, onClick, type, className, disabled }: Props) => {
  const buttonClass = className ? `${S[className]}` : ''

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type as 'button' | 'submit' | 'reset'}
      disabled={disabled}
    >
      {text}
      <br />
      {phone}
    </button>
  )
}

export default Button
