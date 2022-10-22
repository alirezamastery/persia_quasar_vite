import {ToggleVariantStatusForm} from 'src/types/domain/products/toggle-variant-status'
import {ToggleVariantStatusRequest} from 'src/types/network/payload/products/toggle-variant-status'
import {VariantSelector} from 'src/types/network/response/products/variant'

export function variantStatusFormToRequest(form: ToggleVariantStatusForm): ToggleVariantStatusRequest {
  return {
    actual_product_id: form.actualProductId!,
    selector_ids: form.variantSelectors!.map((selector: VariantSelector) => selector.id),
    is_active: form.isActive!,
  }
}
