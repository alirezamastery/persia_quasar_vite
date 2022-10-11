import {VariantSelector} from 'src/types/network/response/products/variant'


export enum StorageKeys {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  USER = 'USER',
  IS_DARK = 'IS_DARK',
  REMEMBER_ME = 'REMEMBER_ME',
  MOBILE = 'MOBILE'
}


export const logger = (...msg: string[]): void => {
  let txt = ''
  msg.forEach(item => {
    txt += ' ' + item
  })
  console.log('PERSIA-LOG |', txt)
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
