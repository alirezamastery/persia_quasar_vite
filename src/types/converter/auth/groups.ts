import {AuthGroupResponse, AuthPermissionResponse} from 'src/types/network/response/auth/user'
import {AuthGroupForm} from 'src/types/domain/auth/user'
import {AuthGroupPayload} from 'src/types/network/payload/auth/user'

export function authGroupResponseToForm(data: AuthGroupResponse): AuthGroupForm {
  return {
    name: data.name,
    permissions: data.permissions.map((perm: AuthPermissionResponse) => perm.id),
  }
}

export function authGroupFormTpPayload(form: AuthGroupForm): AuthGroupPayload {
  return {
    name: form.name,
    permissions: form.permissions,
  }
}
