import {VariantResponse} from 'src/typings/network/response/variant'
import {VariantAddEditForm, VariantDomain} from 'src/typings/domain/variant'
import {VariantRequestPayload} from 'src/typings/network/payload/variant'
import {removeCommas} from 'src/modules/number-tools'

export function variantResponseToDomain(res: VariantResponse): VariantDomain {
  return {
    dkpc: res.dkpc,
    priceMin: res.price_min.toString(),
    isActive: res.is_active,
    productId: res.product.id,
    actualProductId: res.actual_product.id,
    variantSelectorId: res.selector.id,
  }
}

export function variantDomainToRequestPayload(data: VariantDomain): VariantRequestPayload {
  return {
    dkpc: data.dkpc,
    price_min: parseInt(removeCommas(data.priceMin)),
    is_active: data.isActive,
    product: data.productId,
    actual_product: data.actualProductId,
    selector: data.variantSelectorId,
  }
}

export function variantResponseToForm(res: VariantResponse): VariantAddEditForm {
  return {
    dkpc: res.dkpc,
    priceMin: res.price_min.toString(),
    isActive: res.is_active,
    productId: res.product.id,
    actualProductId: res.actual_product.id,
    variantSelectorId: res.selector.id,
  }
}

export function variantFormToRequestPayload(data: VariantAddEditForm): VariantRequestPayload {
  return {
    dkpc: data.dkpc!,
    price_min: parseInt(removeCommas(data.priceMin)),
    is_active: data.isActive,
    product: data.productId!,
    actual_product: data.actualProductId!,
    selector: data.variantSelectorId!,
  }
}
