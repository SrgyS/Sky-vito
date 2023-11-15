import S from './Adv.module.scss'

type Props = { children: string; className?: string }

const Title = ({ children, className }: Props) => {
  return (
    <h1 className={`${S.adv__title} ${className ? S[className] : ''}`}>
      {children}
    </h1>
  )
}

export default Title
