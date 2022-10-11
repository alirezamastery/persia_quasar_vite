export const addThousandSeparators = (x: number | string): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const removeCommas = (val: Nullable<string>): string => {
  const str = val || ''
  return String(str).replace(/,/g, '')
}

export const formatAsCommaSeparated = (val: string | number): string => {
  if (typeof val === 'number') {
    return addThousandSeparators(val)
  }
  const commaRemoved = removeCommas(val)
  return addThousandSeparators(commaRemoved)
}

export const parseCommaSeparatedInt = (val: string): number => {
  return parseInt(removeCommas(val))
}
