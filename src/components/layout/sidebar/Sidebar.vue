<template>
  <q-drawer
    v-model="generalState.sideOpen"
    show-if-above
    bordered
    elevated
    style="overflow: hidden"
  >
    <BannerDesktop v-if="$q.screen.gt.sm" @height-change="handleUserInfoHeightChange"/>
    <UserInfoMobile v-else @height-change="handleUserInfoHeightChange"/>
      <q-scroll-area :style="scrollStyle">
    <q-list>
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
              <q-item-section v-if="subItem.iconSide" side>
                <q-icon :name="subItem.iconSide"/>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </template>
    </q-list>
      </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import useUserStore from 'stores/user'
import {generalState, menuItems} from './composables'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import BannerDesktop from './BannerDesktop.vue'
import UserInfoMobile from './UserInfoMobile.vue'
import RouteNames from 'src/router/route-names'

const userStore = useUserStore()
const router = useRouter()
const scrollStyle = ref('')

if (userStore.isAuthenticated) {
  axiosInstance.get(urls.userProfile)
    .then(res => {
      console.log('profile:', res)
      userStore.setProfile(res.data)
    })
    .catch(err => {
      console.log(err)
      router.push({name: RouteNames.LOGIN})
    })
}

function handleUserInfoHeightChange(newHeight: number) {
  scrollStyle.value = `height: calc(100vh - ${newHeight + 1}px)`
}
</script>
