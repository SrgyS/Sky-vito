import S from './FullAdvCard.module.scss'

type Props = { src: string; alt: string }

const BigImg = ({ src, alt }: Props) => {
  return <img className={S.big_img} src={src} alt={alt} />
}

export default BigImg
