import {VariantSelector} from 'src/types/network/response/products/variant'

export interface ToggleVariantStatusForm {
  actualProductId: Nullable<number>
  variantSelectors: Nullable<VariantSelector[]>
  isActive: Nullable<boolean>
}
