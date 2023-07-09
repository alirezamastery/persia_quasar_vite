import {parseCommaSeparatedInt} from 'src/modules/number-tools'
import {ShopProductAddVariantForm, ShopVariantForm} from 'src/types/domain/shop/variant'
import {ShopProductAddVariantPayload, ShopVariantPayload} from 'src/types/network/payload/shop/variant'


export function shopVariantFormToPayload(form: ShopVariantForm): ShopVariantPayload {
  return {
    product: form.productId,
    selector_value: form.selectorValueId,
    price: parseCommaSeparatedInt(form.price),
    is_active: form.isActive,
  }
}

export function shopProductAddVariantToPayload(form: ShopProductAddVariantForm): ShopProductAddVariantPayload {
  return {
    product: form.productId,
    selector_value: form.selectorValue.id,
    is_active: form.isActive,
    price: parseCommaSeparatedInt(form.price),
    inventory: parseCommaSeparatedInt(form.inventory),
    max_in_order: parseCommaSeparatedInt(form.maxInOrder),
  }
}
