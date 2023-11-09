import S from './FullAdvCard.module.scss'

type Props = { src: string; alt: string; onClick: () => void; selected: string }

const SmallImg = ({ src, alt, onClick, selected }: Props) => {
  return (
    <img
      className={`${S.small_img} ${selected}`}
      src={src}
      alt={alt}
      onClick={onClick}
    />
  )
}

export default SmallImg
