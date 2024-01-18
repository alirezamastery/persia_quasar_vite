import { UserProfilePayload } from 'src/types/network/payload/auth/user-profile'
import { UserProfileResponse } from 'src/types/network/response/auth/profile'
import { UserProfileDomain, UserProfileForm } from 'src/types/domain/auth/profile'

export function userProfileResponseToDomain(
  data: UserProfileResponse
): UserProfileDomain {
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    avatar: data.avatar,
  }
}

export function userProfileFormToPayload(form: UserProfileForm): UserProfilePayload {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
  }
}
