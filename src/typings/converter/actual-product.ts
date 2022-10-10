import {ActualProductAddEditForm} from 'src/typings/domain/actual-product'
import {ActualProductResponse} from 'src/typings/network/response/actual-product'
import {ActualProductPayload} from 'src/typings/network/payload/actual-product'


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
