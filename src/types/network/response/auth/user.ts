import { UserProfileResponse } from 'src/types/network/response/auth/profile'

export interface UserResponse {
  id: string
  mobile: string

  is_staff: boolean
  is_active: boolean
  is_superuser: boolean

  last_login: string

  auth_groups: AuthGroupResponse[]

  user_permissions: AuthPermissionResponse[]
  permissions: AuthPermissionResponse[]

  profile: UserProfileResponse
}

export interface AuthGroupResponse {
  id: number
  name: string
  permissions: AuthPermissionResponse[]
}

export interface AuthPermissionResponse {
  id: number
  name: string
  codename: string
}
