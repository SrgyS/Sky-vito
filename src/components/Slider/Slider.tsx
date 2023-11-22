import S from './Slider.module.scss'
import { useState } from 'react'
import { IImage } from 'types'
import { baseUrl } from 'utils/utils'

import { useNavigate } from 'react-router-dom'

import { MobileBackBtn } from 'common/buttons/MobileBtnWhite'

type Props = { images?: IImage[] }

const Slider = ({ images }: Props) => {
  const navigate = useNavigate()

  const [startX, setStartX] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX
    const diff = startX - currentX

    if (images && diff > 60) {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    } else if (images && diff < -60) {
      setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  return (
    <div className={S.container}>
      <MobileBackBtn onClick={() => navigate(-1)} />
      {images?.map((img, index) => (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
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
