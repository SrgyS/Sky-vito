import { format, formatDistanceToNow, parseISO } from 'date-fns'
import ruLocale from 'date-fns/locale/ru'

export const formatUserDate = (date: string) => {
  const parseDate = parseISO(date)

  return format(parseDate, 'MMMM yyyy', { locale: ruLocale })
}

export const formatAdvDate = (dateTimeString: string) => {
  const inputDate = parseISO(dateTimeString)
  const timeDistance = formatDistanceToNow(inputDate, {
    addSuffix: true,
    locale: ruLocale,
  })

  return timeDistance
}
export const formatPrice = (price: number | string) => {
  return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

export const validateSearchText = (text: string) => {
  text = text.replace(/<|>|\.+/g, '')
  text = text.trim().replace(/\s+/g, ' ')
  return text
}
export const declineWord = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'отзыв'
  }
  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  ) {
    return 'отзыва'
  }
  return 'отзывов'
}
export const baseUrl = 'http://localhost:8090'
