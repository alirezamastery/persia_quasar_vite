<template>
  <div
    class="q-ma-md q-pa-sm"
  >
    <div class="row">
      <!--      <q-img :src="imgUrl" height="50" width="50"/>-->
      <q-list
        class="col-xs-12 col-md-6 col-lg-3"
        bordered
      >
        <q-item-label header>{{ $t('general.users') }}</q-item-label>
        <template
          v-for="(user, i) in users.filter(u => u.mobile !== userMobile)"
          :key="user.mobile"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="user.profile.avatar" alt="">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                {{ user.profile.firstName }} {{ user.profile.lastName }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ user.mobile }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-btn
                color="green"
                icon="call"
                :disable="!canCall"
                @click="inviteToCall(user)"
              />
            </q-item-section>
          </q-item>

          <q-separator v-if="i > 0" inset="item"/>
        </template>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRouter} from 'vue-router'
import useUserStore from 'stores/user'
import useWebRTCStore from 'stores/webrtc'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import {userResponseToDomain} from 'src/types/converter/profile/user-profile'
import {UserResponse} from 'src/types/network/response/auth/user'
import {UserDomain} from 'src/types/domain/auth/user'


const router = useRouter()
const webrtcStore = useWebRTCStore()
const userStore = useUserStore()

const users = ref<UserDomain[]>([])

const userMobile = computed(() => userStore.user)
const canCall = computed(() => {
  return !webrtcStore.waitingForAnswer
    && !webrtcStore.hasCallInvite
    && !webrtcStore.callConnected
})
const waitingForAnswer = computed(() => webrtcStore.waitingForAnswer)

watch(waitingForAnswer, () => router.push({name: 'CallWaiting'}))
watch(() => webrtcStore.callConnected, (newVal) => {
  if (newVal)
    router.push({name: 'CallConnected'})
})

function inviteToCall(targetUser: UserDomain) {
  console.log('targetUser:', targetUser)
  webrtcStore.InviteToCall(targetUser)
}

axiosInstance.get<UserResponse[]>(urls.users)
  .then(res => {
    console.log('res users: ', res.data)
    const usersDomain: UserDomain[] = []
    for (const user of res.data) {
      usersDomain.push(userResponseToDomain(user))
    }
    console.log('users domain:', usersDomain)
    users.value = usersDomain
  })

</script>
