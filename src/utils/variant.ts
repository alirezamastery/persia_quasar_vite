import {VariantSelector} from 'src/types/network/response/products/variant'

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
