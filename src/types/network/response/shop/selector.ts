export interface ShopSelectorTypeDetailResponse {
  id: number
  title: string
  code: 'COLOR' | 'SIZE'
  values: ShopSelectorTypeValueResponse[]
}

export interface ShopSelectorTypeValueResponse {
  id: number
  type: number
  title: string
  value: string
  extra_info: string
}

export interface ShopSelectorValueResponse {
  id: number
  type: number
  title: string
  value: string
  extra_info: string
}
