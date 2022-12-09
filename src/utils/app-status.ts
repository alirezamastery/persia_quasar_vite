import {computed} from 'vue'
import {Dark, Screen} from 'quasar'

export const isMobileLightMode = computed(() => !Dark.isActive && !Screen.gt.sm)
export const isMobileSize = computed(() => Screen.lt.md)
