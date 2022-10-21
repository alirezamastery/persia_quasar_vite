import {ToggleVariantStatusForm} from 'src/types/domain/products/toggle-variant-status'
import {ToggleVariantStatusRequest} from 'src/types/network/payload/products/toggle-variant-status'

export function variantStatusFormToRequest(form: ToggleVariantStatusForm): ToggleVariantStatusRequest {
  return {
    actual_product_id: form.actualProductId!,
    selector_ids: form.selectorIds,
    is_active: form.isActive!,
  }
}
