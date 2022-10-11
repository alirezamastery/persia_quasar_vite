import {i18n} from 'src/boot/i18n'

export function isRequired(val: Nullable<string | number>): boolean | string {
  const {t} = i18n.global
  return !!val || t('general.error.fieldIsRequired')
}

export function positiveNumber(val: Nullable<string | number>): boolean | string {
  const {t} = i18n.global
  const value = parseInt(String(val)) || 0
  return value >= 0 || t('general.error.positiveNumber')
}

export function positiveNaturalNumber(val: Nullable<string | number>): boolean | string {
  const {t} = i18n.global
  const value = parseInt(String(val)) || 0
  return value > 0 || t('general.error.positiveNaturalNumber')
}
