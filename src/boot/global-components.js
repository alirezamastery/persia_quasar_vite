import { boot } from 'quasar/wrappers'
import {Cropper} from 'vue-advanced-cropper'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({app}) => {
  app.component('Cropper', Cropper)
})
