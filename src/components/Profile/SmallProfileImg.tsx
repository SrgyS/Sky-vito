import S from './Profile.module.scss'

type Props = { src: string; alt: string }

const SmallProfileImg = ({ src, alt }: Props) => {
  return (
    <div className={S.profile__small_img}>
      <img src={src} alt={alt} />
    </div>
  )
}

export default SmallProfileImg
