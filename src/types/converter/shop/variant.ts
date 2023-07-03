import {ShopVariantForm} from 'src/types/domain/shop/variant'
import {ShopVariantPayload} from 'src/types/network/payload/shop/variant'
import {parseCommaSeparatedInt} from 'src/modules/number-tools'

export function shopVariantFormToPayload(form: ShopVariantForm): ShopVariantPayload {
  return {
    product: form.productId,
    selector_value: form.selectorValueId,
    price: parseCommaSeparatedInt(form.price),
    is_active: form.isActive,
  }
}
