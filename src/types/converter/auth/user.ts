import {
  UserResponse,
  AuthGroupResponse,
  AuthPermissionResponse,
} from 'src/types/network/response/auth/user'
import {
  AuthGroupDomain,
  AuthPermissionDomain,
  UserCreateForm,
  UserDomain,
  UserUpdateForm,
} from 'src/types/domain/auth/user'
import {UserCreatePayload, UserUpdatePayload} from 'src/types/network/payload/auth/user'
import {userProfileResponseToDomain} from 'src/types/converter/auth/user-profile'


export function userResponseToDomain(data: UserResponse): UserDomain {
  const authGroups = data.auth_groups.map((gp: AuthGroupResponse) => <AuthGroupDomain>{
    id: gp.id,
    name: gp.name,
    permissions: gp.permissions.map((perm: AuthPermissionResponse) => <AuthPermissionDomain>{
      id: perm.id,
      name: perm.name,
      codename: perm.codename,
    }),
  })
  const userPermissions = data.user_permissions.map((item: AuthPermissionResponse) => <AuthPermissionDomain>{
    id: item.id,
    name: item.name,
    codename: item.codename,
  })
  const authGpPerms = authGroups.map(gp => gp.permissions)
  const perms = [...userPermissions, ...authGpPerms.flat()]

  return {
    id: data.id,
    mobile:data.mobile,
    isStaff: data.is_staff,
    isActive: data.is_active,
    isSuperuser: data.is_superuser,
    lastLogin: data.last_login,
    authGroups: authGroups,
    userPermissions: userPermissions,
    permissions: perms,
    profile: userProfileResponseToDomain(data.profile),
  }
}

export function userResponseToForm(data: UserResponse): UserUpdateForm {
  return {
    id: data.id,
    mobile:data.mobile,
    isSuperuser: data.is_superuser,
    isStaff: data.is_staff,
    isActive: data.is_active,
    authGroups: data.auth_groups.map((item: AuthGroupResponse) => item.id),
    userPermissions: data.user_permissions.map((item: AuthPermissionResponse) => item.id),
  }
}

export function userCreateFormToPayload(form: UserCreateForm): UserCreatePayload {
  return {
    mobile:form.mobile,
    password: form.password,
    is_active: form.isActive,
    is_staff: form.isStaff,
  }
}

export function userUpdateFormToPayload(form: UserUpdateForm): UserUpdatePayload {
  return {
    mobile:form.mobile,
    is_active: form.isActive,
    is_staff: form.isStaff,
    is_superuser: form.isSuperuser,
    groups: form.authGroups,
    user_permissions: form.userPermissions,
  }
}
