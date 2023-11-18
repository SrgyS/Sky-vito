import S from './Adv.module.scss'

type Props = { children: string; className?: string }

const Subtitle = ({ children, className }: Props) => {
  return (
    <h2 className={`${S.adv__subtitle} ${className ? S[className] : ''}`}>
      {children}
    </h2>
  )
}

export default Subtitle
