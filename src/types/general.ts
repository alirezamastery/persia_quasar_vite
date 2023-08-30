export interface GlobalBanner {
  text: string,
  bgColor: string,
  textColor: string,
  key: string,
}

export interface UserProfile {
  first_name: Nullable<string>,
  last_name: Nullable<string>,
  avatar: Nullable<string>,
}

export interface PaginatedResponse<ItemType> {
  next: string | null
  previous: string | null
  count: number
  page_count: number
  items: ItemType[]
  extra_info: any
}
