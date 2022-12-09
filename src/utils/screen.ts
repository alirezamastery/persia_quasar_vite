import {computed} from 'vue'
import {Screen} from 'quasar'


export const parentCardClass = computed(()=> Screen.gt.sm ? 'q-ma-md q-pa-sm' : 'no-shadow no-border-radius')
