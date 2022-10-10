import {i18n} from 'src/boot/i18n'

export function isRequired(val) {
  const {t} = i18n.global
  return !!val || t('general.error.fieldIsRequired')
}

export function positiveNumber(val) {
  const {t} = i18n.global
  return val >= 0 || t('general.error.positiveNumber')
}

export function positiveNaturalNumber(val) {
  console.log('got type:', typeof val)
  const {t} = i18n.global
  return val > 0 || t('general.error.positiveNaturalNumber')
}
