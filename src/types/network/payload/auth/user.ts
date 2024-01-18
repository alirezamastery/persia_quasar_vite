export interface UserCreatePayload {
  mobile: string
  password: string
  is_active: boolean
  is_staff: boolean
}

export interface UserUpdatePayload {
  mobile: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  groups: number[]
  user_permissions: number[]
}

export interface AuthGroupPayload {
  name: string
  permissions: number[]
}
