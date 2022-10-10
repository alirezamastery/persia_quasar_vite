export interface VariantDomain {
  dkpc: number,
  priceMin: string,
  isActive: boolean,
  productId: number,
  actualProductId: number,
  variantSelectorId: number,
}

export interface VariantAddEditForm {
  dkpc: number | null,
  priceMin: string | null,
  isActive: boolean,
  productId: number | null,
  actualProductId: number | null,
  variantSelectorId: number | null,
}

export interface VariantBulkFormItem {
  dkpc: number | null,
  variantSelectorId: number | null,
}

export interface VariantBulkAddForm {
  productId: number | null,
  actualProductId: number | null,
  priceMin: string,
  isActive: boolean,
  variants: VariantBulkFormItem[]
}
