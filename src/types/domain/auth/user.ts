import { UserProfileDomain } from 'src/types/domain/auth/profile'

export interface UserDomain {
  id: string
  mobile: string
  isActive: boolean
  isStaff: boolean
  isSuperuser: boolean
  lastLogin: string
  authGroups: AuthGroupDomain[]
  userPermissions: AuthPermissionDomain[]
  permissions: AuthPermissionDomain[]
  profile: UserProfileDomain
}

export interface AuthGroupDomain {
  id: number
  name: string
  permissions: AuthPermissionDomain[]
}

export interface AuthPermissionDomain {
  id: number
  name: string
  codename: string
  contentType: number
}

export interface AuthGroupForm {
  name: string
  permissions: number[]
}

export interface UserCreateForm {
  mobile: string
  password: string
  passwordRepeat: string
  isActive: boolean
  isStaff: boolean
}

export interface UserUpdateForm {
  id: string
  mobile: string
  isActive: boolean
  isStaff: boolean
  isSuperuser: boolean
  authGroups: number[]
  userPermissions: number[]
}

export interface PasswordForm {
  password: string
  passwordRepeat: string
}
