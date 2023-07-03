export interface ShopCategoryForm {
  title: string
  parentNodeId: number | null
  selectorTypeId: number | null
  attributeIds: Array<{
    id: number | null
  }>
}
