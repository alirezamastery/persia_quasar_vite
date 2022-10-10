export const addCommaToIntNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const removeCommas = (val) => {
  const str = val || ''
  return String(str).replace(/,/g, '')
}

export const formatIntNumber = (val) => {
  const commaRemoved = removeCommas(val)
  return addCommaToIntNumber(commaRemoved)
}

export const numberWithCommaToInt = (val) => {
  return parseInt(removeCommas(val))
}
