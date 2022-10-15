import {UserProfileResponse} from 'src/types/network/response/profile/user-profile'
import {UserProfileDomain, UserProfileForm} from 'src/types/domain/profile/user-profile'
import {UserProfileRequest} from 'src/types/network/payload/profile/user-profile'

export function userProfileResponseToDomain(data: UserProfileResponse): UserProfileDomain {
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    avatar: data.avatar,
  }
}

export function userProfileFormToRequest(form: UserProfileForm): UserProfileRequest {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
  }
}
