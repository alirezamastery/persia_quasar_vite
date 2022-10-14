<template>
  <q-drawer
    v-model="generalState.sideOpen"
    show-if-above
    bordered
    elevated
  >
    <UserInfo v-if="$q.screen.gt.sm" @height-change="handleUserIngoHeightChange"/>
    <UserInfoMobile v-else @height-change="handleUserIngoHeightChange"/>
    <q-list>
      <q-scroll-area :style="scrollStyle">
        <template
          v-for="(item, i) in menuItems"
          :key="i"
        >
          <q-expansion-item
            expand-separator
            :icon="item.icon"
            :label="$t(item.titleI18n)"
            dense-toggle
            default-opened
            :header-style="{ fontSize: '1.1rem' }"
            :header-class="$q.dark.isActive ? 'bg-grey-10 text-cyan-14' : 'bg-grey-2 text-cyan'"
          >
            <q-item
              v-for="(subItem, j) in item.children"
              :key="j"
              :to="{name: subItem.routeName}"
              :inset-level="0.3"
              clickable
              v-ripple
              :active-class="$q.dark.isActive ? 'bg-blue-grey-10 text-cyan' : 'bg-blue-1 text-cyan'"
            >
              <q-item-section v-if="subItem.icon" avatar>
                <q-icon :name="subItem.icon" :size="$q.screen.gt.sm ? 'xs' : 'sm'"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t(subItem.titleI18n) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </template>
      </q-scroll-area>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import useUserStore from 'stores/user'
import {generalState, menuItems} from './composables'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import UserInfo from './UserInfo.vue'
import UserInfoMobile from './UserInfoMobile.vue'

const userStore = useUserStore()
const router = useRouter()
const scrollStyle = ref('')

if (userStore.isAuthenticated) {
  axiosInstance.get(urls.userProfile)
    .then(res => {
      console.log('profile:', res)
      userStore.SetProfile(res.data)
    })
    .catch(err => {
      console.log(err)
      router.push({name: 'Login'})
    })
}

function handleUserIngoHeightChange(newHeight: number) {
  scrollStyle.value = `height: calc(100vh - ${newHeight + 1}px)`
  console.log('scroll h:', scrollStyle.value)
}
</script>
