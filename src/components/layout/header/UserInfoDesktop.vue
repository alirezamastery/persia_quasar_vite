<template>
  <q-item
    dense
    :to="{name: 'Profile'}"
    clickable
    header
    id="side-bar-user-info"
    ref="userInfo"
    class="q-px-sm"
  >
    <q-item-section avatar>
      <q-avatar>
        <img v-if="profile.avatar" :src="userAvatar" alt="">
        <img v-else src="~assets/svg/user-blank.svg" alt="">
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ fullName }}</q-item-label>
      <q-item-label caption lines="1">{{ user }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import useUserStore from 'stores/user'

const userStore = useUserStore()

const user = computed(() => userStore.user)
const profile = computed(() => userStore.profile)
const userAvatar = computed(() => userStore.profile.avatar)
const fullName = computed(() => {
  const firstName = userStore.profile.firstName || ''
  const lastName = userStore.profile.lastName || ''
  return firstName + ' ' + lastName
})
</script>

<style scoped>

</style>
