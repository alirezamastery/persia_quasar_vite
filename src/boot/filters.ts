import {boot} from 'quasar/wrappers'
import {gregorianDateToPersian} from 'src/modules/string-tools'


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({app}) => {
  app.config.globalProperties.$filters = {

    price(val: Nullable<number | string>): string {
      const reverse = (txt: Nullable<number | string>): string =>
          (txt || 0)
              .toString()
              .split('')
              .reverse()
              .join('')

      return reverse(reverse(val).replace(/(\d{3})(?=\d)/g, '$1,'))
    },

    persianDate(dateString: string, format = 'fa-IR-u-nu-latn') {
      return gregorianDateToPersian(dateString, format)
    },

  }

  app.config.globalProperties.$image = (address: string) => new URL(address, import.meta.url).href

})
