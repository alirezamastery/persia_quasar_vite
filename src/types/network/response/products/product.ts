export interface ProductResponse {
  id: number,
  dkp: string,
  is_active: boolean,
  title: string,
  type: ProductType
}

export interface ProductType {
  id: number,
  title: string,
  selector_type: number,
}
