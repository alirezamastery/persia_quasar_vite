export function gregorianDateToPersian(dateString: string, format = 'fa-IR-u-nu-latn'): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(format, {year: 'numeric', month: '2-digit', day: '2-digit'}).format(date)
}

// export function persianDateToGregorian(dateString: string, format = 'fa-IR-u-nu-latn'): string {
//   if (!dateString) return ''
//   const date = new Date(dateString)
//   return new Intl.DateTimeFormat(format, {dateStyle: 'short'}).format(date)
// }
