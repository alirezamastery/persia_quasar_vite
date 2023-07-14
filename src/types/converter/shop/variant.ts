import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'
import {ShopProductAddVariantForm, ShopVariantForm} from 'src/types/domain/shop/variant'
import {ShopVariantCreatePayload, ShopVariantUpdatePayload} from 'src/types/network/payload/shop/variant'
import {ShopVariantResponse} from 'src/types/network/response/shop/variant'


export function shopProductAddVariantToPayload(form: ShopProductAddVariantForm): ShopVariantCreatePayload {
  return {
    product: form.productId,
    selector_value: form.selectorValue.id,
    is_active: form.isActive,
    price: parseCommaSeparatedInt(form.price),
    inventory: parseCommaSeparatedInt(form.inventory),
    max_in_order: parseCommaSeparatedInt(form.maxInOrder),
  }
}

export function shopVariantResponseToForm(res: ShopVariantResponse): ShopVariantForm {
  return {
    isActive: res.is_active,
    maxInOrder: formatAsCommaSeparated(res.max_in_order),
    inventory: formatAsCommaSeparated(res.inventory),
    price: formatAsCommaSeparated(res.price),
  }
}

export function shopVariantFormToPayload(form: ShopVariantForm): ShopVariantUpdatePayload {
  return {
    is_active: form.isActive,
    price: parseCommaSeparatedInt(form.price),
    inventory: parseCommaSeparatedInt(form.inventory),
    max_in_order: parseCommaSeparatedInt(form.maxInOrder),
  }
}
