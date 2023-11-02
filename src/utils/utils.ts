export const formatDate = (dateTimeString: string) => {
  const currentDate = new Date()
  const inputDate = new Date(dateTimeString)

  const diffInMs = Math.abs(currentDate.getTime() - inputDate.getTime())
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return `сегодня в ${inputDate.toLocaleTimeString()}`
  }

  if (diffInDays < 7) {
    return `${diffInDays} дней назад`
  }
  if (diffInDays < 31) {
    return `${Math.floor(diffInDays / 7)} недель назад`
  }

  return `${inputDate.toLocaleDateString()}`
}

export const formatPrice = (price: number) => {
  return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

export const validateSearchText = (text: string) => {
  text = text.replace(/<|>|\.+/g, '')
  text = text.trim().replace(/\s+/g, ' ')
  return text
}
