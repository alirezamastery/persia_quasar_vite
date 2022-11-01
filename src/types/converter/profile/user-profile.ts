import {UserProfileResponse} from 'src/types/network/response/profile/user-profile'
import {UserProfileDomain, UserProfileForm} from 'src/types/domain/profile/user-profile'
import {UserProfileRequest} from 'src/types/network/payload/profile/user-profile'
import {UserResponse} from 'src/types/network/response/auth/user'
import {UserDomain} from 'src/types/domain/auth/user'

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

export function userResponseToDomain(data: UserResponse): UserDomain {
  return {
    mobile: data.mobile,
    profile: userProfileResponseToDomain(data.profile),
  }
}
