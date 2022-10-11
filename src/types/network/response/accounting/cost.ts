export interface CostResponse {
  id: number
  amount: number
  date: string
  description: string
  type: CostType
}

export interface CostType {
  id: number
  title: string
}
