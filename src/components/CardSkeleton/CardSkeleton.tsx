import Skeleton from 'react-loading-skeleton'
import S from './CardSkeleton.module.scss'
type Props = { isMobile: boolean }

const CardSkeleton = ({ isMobile }: Props) => {
  return (
    <div className={S.skeleton}>
      {isMobile ? (
        <Skeleton width={137} height={273} />
      ) : (
        <Skeleton width={270} height={441} />
      )}
    </div>
  )
}

export default CardSkeleton
