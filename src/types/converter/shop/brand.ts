import {ShopBrandResponse} from 'src/types/network/response/shop/brand'
import {ShopBrandForm} from 'src/types/domain/shop/product'
import {ShopBrandPayload} from 'src/types/network/payload/shop/product'

export function shopBrandResponseToForm(data: ShopBrandResponse): ShopBrandForm {
  return {
    title: data.title,
  }
}


export function shopBrandFomToPayload(form: ShopBrandForm): ShopBrandPayload {
  return {
    title: form.title,
  }
}
