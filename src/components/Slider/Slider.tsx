import S from './Slider.module.scss'
import { useState } from 'react'
import { IImage } from 'types'
import { baseUrl } from 'utils/utils'
import leftArrowUrl from 'assets/img/arrow-left.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCurrentAdv } from 'hooks/useCurrentAdv'

type Props = { images?: IImage[] }

const Slider = ({ images }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id, user_id } = useCurrentAdv()

  const handleGoBack = () => {
    const currentPath = location.pathname
    console.log('pathname: ' + currentPath, 'user_id:', user_id)

    let redirectTo
    switch (currentPath) {
      case `/ads/${id}`:
        redirectTo = '/'
        break

      case `/user/ads/${id}`:
        console.log('test')
        redirectTo = `/user/${user_id}`
        break

      case '/review':
        redirectTo = currentPath
        break
      default:
        redirectTo = currentPath
    }

    navigate(redirectTo)
  }

  //   const [startX, setStartX] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)

  //   const handleTouchStart = (e: React.TouchEvent) => {
  //     setStartX(e.touches[0].clientX)
  //   }
  //   const handleTouchMove = (e: React.TouchEvent) => {
  //     const currentX = e.touches[0].clientX
  //     const diff = startX - currentX

  //     if (diff > 30) {
  //       setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  //     } else if (diff < -30) {
  //       setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  //     }
  //   }

  return (
    <div className={S.container}>
      <div className={S.back_btn} onClick={handleGoBack}></div>
      {images?.map((img, index) => (
        <div
          key={index}
          className={`${S.slide} ${currentSlide === index ? S.active : ''}`}
        >
          <img src={`${baseUrl}/${img.url}`} alt="" />
        </div>
      ))}

      <div className={S.dots}>
        {images &&
          images.length > 1 &&
          images?.map((_, index) => (
            <div
              key={index}
              className={`${S.dot} ${currentSlide === index ? S.active : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
      </div>
    </div>
  )
}

export default Slider
