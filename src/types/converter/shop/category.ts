import {ShopCategoryForm} from 'src/types/domain/shop/category'
import {ShopCategoryPayload} from 'src/types/network/payload/shop/category'
import {ShopCategoryDetailResponse} from 'src/types/network/response/shop/category'

export function shopCategoryDetailResponseToForm(date: ShopCategoryDetailResponse): ShopCategoryForm {
  return {
    title: date.title,
    selectorTypeId: date.selector_type,
    parentNodeId: date.parent_node_id,
    attributeIds: date.attribute_ids.map(attr => ({
      id: attr.id,
    })),
  }
}

export function shopCategoryFormToPayload(form: ShopCategoryForm): ShopCategoryPayload {
  return {
    title: form.title,
    parent: form.parentNodeId!,
    selector_type: form.selectorTypeId!,
    attributes: form.attributeIds.map(attr => attr.id!),
  }
}
