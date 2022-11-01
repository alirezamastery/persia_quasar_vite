import {UserProfileDomain} from 'src/types/domain/profile/user-profile'

export interface UserDomain {
  mobile: string
  profile: UserProfileDomain
}
