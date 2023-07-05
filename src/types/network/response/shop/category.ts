export interface ShopCategoryListResponse {
  id: number
  title: string
  selector_type: number
}

export interface ShopCategoryDetailResponse {
  id: number
  title: string
  selector_type: number
  parent_node_id: number
  attributes: Array<{
    id: number
    title: string
    description: string
  }>
}
