<template>
  <q-card
    :class="isMobileLightMode ? 'bg-cyan-8' : ''"
    class="no-border-radius"
    id="side-bar-user-info"
    ref="userInfoMobile"
  >
    <q-item class="flex justify-between">
      <q-item-section
        avatar
        @click="handleAvatarClick"
      >
        <q-avatar size="4rem">
          <img v-if="profile.avatar" :src="userAvatar" alt="">
          <img v-else src="~assets/svg/user-blank.svg" alt="">
        </q-avatar>
      </q-item-section>
      <q-item-section
        side
        top
        style="padding-left: 0"
      >
        <q-btn
          v-if="$q.dark.isActive"
          text-color="amber"
          icon="light_mode"
          class="bg-transparent"
          @click="handleThemeToggle"
          round
          flat
        />
        <q-btn
          v-else
          text-color="white"
          icon="fa fa-moon"
          class="bg-transparent"
          @click="handleThemeToggle"
          round
          flat
        />
      </q-item-section>
    </q-item>

    <q-item
      class="q-pb-sm"
      clickable :to="{name: 'Profile'}"
    >
      <q-item-section>
        <q-item-label class="text-white">
          {{ user }}
        </q-item-label>
        <q-item-label
          caption
          lines="1"
          class="text-white"
        >
          {{ fullName }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useElementSize} from '@vueuse/core'
import useUserStore from 'stores/user'
import {handleThemeToggle} from 'src/utils'
import {isMobileLightMode} from 'src/utils'
import RouteNames from 'src/router/route-names'

const emits = defineEmits(['height-change'])
const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const profile = computed(() => userStore.profile)
const userAvatar = computed(() => userStore.profile.avatar)
const fullName = computed(() => {
  const firstName = userStore.profile.firstName || ''
  const lastName = userStore.profile.lastName || ''
  return firstName + ' ' + lastName
})

async function handleAvatarClick() {
  await router.push({name: RouteNames.PROFILE})
}

const userInfoMobile = ref(null)
const {height} = useElementSize(userInfoMobile)
watch(height, (newVal) => {
  console.log('new height:', newVal)
  emits('height-change', newVal)
})
</script>
