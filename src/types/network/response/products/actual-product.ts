export interface ActualProductResponse {
  id: number,
  title: string,
  price_step: number,
  brand: Brand,
}

export interface Brand {
  id: number,
  title: string
}
