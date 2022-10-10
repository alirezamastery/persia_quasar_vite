import {VariantDigikalaResponse} from './variant-digikala'
// import {VariantAddEditForm} from 'src/typings/domain/variant'

export interface VariantResponse {
  id: number,
  dkpc: number,
  price_min: number,
  stop_loss: number,
  is_active: boolean,
  has_competition: boolean,
  product: Product,
  selector: VariantSelector,
  actual_product: ActualProduct,
}

// export class VariantResponse {
//
//   constructor(
//       readonly id: number,
//       readonly dkpc: number,
//       readonly price_min: number,
//       readonly stop_loss: number,
//       readonly is_active: boolean,
//       readonly has_competition: boolean,
//       readonly product: Product,
//       readonly selector: VariantSelector,
//       readonly actual_product: ActualProduct,
//   ) {
//   }
//
//   asDomainModel(): VariantAddEditForm {
//     return {
//       dkpc: this.dkpc,
//       priceMin: this.price_min.toString(),
//       isActive: this.is_active,
//       productId: this.product.id,
//       actualProductId: this.actual_product.id,
//       variantSelectorId: this.selector.id,
//     }
//   }
// }

export interface VariantDkResponse extends VariantResponse {
  dk: VariantDigikalaResponse
}

export interface InactiveVariantsResponse {
  total_count: number,
  items: VariantDigikalaResponse[]
}

export interface VariantSelectorType {
  id: number,
  title: string
}

export interface VariantSelector {
  id: number,
  digikala_id: number,
  extra_info: string | null,
  value: string,
  selector_type: VariantSelectorType
}

export interface ProductType {
  id: number,
  title: string,
  selector_type: VariantSelectorType,
}

export interface Product {
  id: number,
  dkp: string,
  is_active: boolean,
  title: string,
  type: ProductType
}

export interface Brand {
  id: number,
  title: string
}

export interface ActualProduct {
  id: number,
  title: string,
  price_step: number,
  brand: Brand,
}


