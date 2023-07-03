import {computed} from 'vue'
import {Screen} from 'quasar'


export const parentCardClass = computed(()=> Screen.gt.sm ? 'q-ma-xl q-pa-sm' : 'q-py-sm no-shadow no-border-radius')
