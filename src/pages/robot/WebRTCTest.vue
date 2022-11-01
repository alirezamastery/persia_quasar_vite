<template>
  <div class="q-ma-md q-pa-sm">

    <div class="row">

      <q-list
        v-show="!callConnected"
        class="col-xs-12 col-sm-8 col-md-6 col-lg-3"
        bordered
      >
        <q-item-label header>{{ $t('general.users') }}</q-item-label>
        <template
          v-for="(user, i) in users.filter(u => u.mobile !== userMobile)"
          :key="user.id"
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
                :disable="webrtcStore.hasCallInvite"
                @click="inviteToCall(user)"
              />
            </q-item-section>
          </q-item>

          <q-separator v-if="i > 0" inset="item"/>
        </template>
      </q-list>

      <div
        v-if="callConnected"
        class="col-xs-10 col-sm-8 col-md-5 col-lg-3"
        id="camera-container"
      >
        <div v-if="callee">
          <q-img v-if="callee.profile.avatar" :src="callee.profile.avatar" alt=""/>
        </div>
        <audio id="received_audio" autoplay></audio>
        <q-btn
          id="hangup-button"
          @click="hangUpCall"
          color="red"
          class="full-width"
        >
          <q-icon name="phone_disabled"/>
        </q-btn>
      </div>

    </div>
  </div>

  <!--    <div class="flexChild" id="camera-container">-->
  <!--      <div class="camera-box">-->
  <!--        <video id="local_video" autoplay muted></video>-->
  <!--        <video id="received_video" autoplay></video>-->
  <!--        <q-btn-->
  <!--          v-show="callConnected"-->
  <!--          id="hangup-button"-->
  <!--          @click="hangUpCall"-->
  <!--          color="red"-->
  <!--        >-->
  <!--          <q-icon name="phone_disabled"/>-->
  <!--        </q-btn>-->
  <!--      </div>-->
  <!--    </div>-->

</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import useUserStore from 'src/stores/user'
import useWebRTCStore from 'stores/webrtc'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {UserResponse} from 'src/types/network/response/auth/user'
import {UserDomain} from 'src/types/domain/auth/user'
import {userResponseToDomain} from 'src/types/converter/profile/user-profile'


const webrtcStore = useWebRTCStore()
const userStore = useUserStore()

const users = ref<UserDomain[]>([])

const userMobile = computed(() => userStore.user)
const callConnected = computed(() => webrtcStore.myPeerConnection !== null)
const callee = computed(() => webrtcStore.callee)


// console.log('adapter.browserDetails.browser:', adapter.browserDetails.browser)

function inviteToCall(targetUser: UserDomain) {
  console.log('targetUser:', targetUser)
  webrtcStore.InviteToCall(targetUser)
}

function hangUpCall() {
  webrtcStore.hangUpCall()
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

<style scoped>

</style>
