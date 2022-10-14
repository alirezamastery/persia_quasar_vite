<template>
  <q-item
    class="q-px-md"
    :to="{name: 'Profile'}"
    clickable
    header
    id="side-bar-user-info"
    ref="userInfo"
  >
    <q-item-section avatar>
      <q-avatar>
        <img v-if="profile.avatar" :src="userAvatar" alt="">
        <img v-else src="~assets/svg/user-blank.svg" alt="">
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ user }}</q-item-label>
      <q-item-label caption lines="1">{{ fullName }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import useUserStore from 'stores/user'

const emits = defineEmits(['height-change'])
const userStore = useUserStore()
let userInfoHeight = ref(0)

const user = computed(() => userStore.user)
const profile = computed(() => userStore.profile)
const userAvatar = computed(() => userStore.profile.avatar)
const fullName = computed(() => {
  const firstName = userStore.profile.first_name || ''
  const lastName = userStore.profile.last_name || ''
  return firstName + ' ' + lastName
})

watch(userInfoHeight, (newVal) => {
  console.log('new height:', newVal)
  emits('height-change', newVal)
})

onMounted(() => {
  const userInfoEl = document.getElementById('side-bar-user-info')
  userInfoHeight.value = userInfoEl!.clientHeight
})
</script>

<style scoped>

</style>
