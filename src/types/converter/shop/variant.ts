import {ShopProductAddVariantForm, ShopVariantForm} from 'src/types/domain/shop/variant'
import {ShopProductAddVariantPayload, ShopVariantPayload} from 'src/types/network/payload/shop/variant'
import {parseCommaSeparatedInt} from 'src/modules/number-tools'

export function shopVariantFormToPayload(form: ShopVariantForm): ShopVariantPayload {
  return {
    product: form.productId,
    selector_value: form.selectorValueId,
    price: parseCommaSeparatedInt(form.price),
    is_active: form.isActive,
  }
}

export function shopAddVariantFormToPayload(form: ShopProductAddVariantForm): ShopProductAddVariantPayload {
  return {
    product: form.productId,
    selector_value: form.selectorValueId,
    is_active: form.isActive,
    price: parseCommaSeparatedInt(form.price),
    max_in_order: form.maxInOrder,
    inventory: form.inventory,
  }
}
