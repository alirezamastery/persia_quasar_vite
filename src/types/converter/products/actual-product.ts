import {ActualProductAddEditForm} from 'src/types/domain/products/actual-product'
import {ActualProductResponse} from 'src/types/network/response/products/actual-product'
import {ActualProductPayload} from 'src/types/network/payload/products/actual-product'


export function actualProductResponseToForm(data: ActualProductResponse): ActualProductAddEditForm {
  return {
    title: data.title,
    priceStep: data.price_step,
    brandId: data.brand.id,
  }
}

export function actualProductFormToPayload(form: ActualProductAddEditForm): ActualProductPayload {
  return {
    title: form.title,
    price_step: form.priceStep!,
    brand: form.brandId!,
  }
}
