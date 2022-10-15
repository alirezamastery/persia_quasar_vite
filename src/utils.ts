import {computed} from 'vue'
import {VariantSelector} from 'src/types/network/response/products/variant'
import {LocalStorage, Dark, Screen} from 'quasar'


export enum StorageKeys {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  USER = 'USER',
  IS_DARK = 'IS_DARK',
  REMEMBER_ME = 'REMEMBER_ME',
  MOBILE = 'MOBILE'
}

export const isMobileLightMode = computed(() => !Dark.isActive && !Screen.gt.sm)

export const persianMonth = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

export const logger = (...msg: string[]): void => {
  let txt = ''
  msg.forEach(item => {
    txt += ' ' + item
  })
  console.log('PERSIA-LOG |', txt)
}

export function handleThemeToggle() {
  Dark.toggle()
  LocalStorage.set(StorageKeys.IS_DARK, Dark.isActive)
}


export interface VisualizeSelectorClasses {
  'background-color'?: Nullable<string>,
  color?: Nullable<string>
}

export function visualizeVariantSelector(selector: VariantSelector): VisualizeSelectorClasses {
  if (selector.selector_type.title === 'color') {
    if (selector.digikala_id === 1) {
      return {
        'background-color': '#000000',
        'color': '#FFFFFF',
      }
    }
    return {
      'background-color': selector.extra_info,
      'color': 'black',
    }
  }
  return {}
}
