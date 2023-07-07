export interface ShopVariantSelectorTypeDetailResponse {
  id: number
  title: string
  code: 'COLOR' | 'SIZE'
  values: ShopVariantSelectorValueResponse[]
}

export interface ShopVariantSelectorValueResponse {
  id: number
  type: number
  title: string
  value: string
  extra_info: string
}
