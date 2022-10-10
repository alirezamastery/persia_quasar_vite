import {VariantSelector} from 'src/typings/types'

export const logger = (...msg: string[]): void => {
  let txt = ''
  msg.forEach(item => {
    txt += ' ' + item
  })
  console.log('PERSIA-LOG |', txt)
}


export interface VisualizeSelectorClasses {
  'background-color'?: string | null,
  color?: string
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
