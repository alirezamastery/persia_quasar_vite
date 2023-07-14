import {ShopSelectorTypeDetailResponse} from 'src/types/network/response/shop/selector'

export interface ShopVariantForm {
  isActive: boolean
  maxInOrder: string
  inventory: string
  price: string
}

export interface ShopProductAddVariantForm {
  productId: number
  selectorValue: ShopSelectorTypeDetailResponse['values'][number]
  isActive: boolean
  maxInOrder: string
  inventory: string
  price: string
}
