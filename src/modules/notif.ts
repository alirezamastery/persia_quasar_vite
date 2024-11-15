import useGeneralStore from 'src/stores/general'
import {Notify, QNotifyCreateOptions, uid} from 'quasar'
import {AxiosError} from 'axios'


const errorActions = [
  {label: '', icon: 'close', color: 'white', round: true},
]

export function addBanner(text: string, bgColor?: string, textColor?: string) {
  const generalStore = useGeneralStore()
  generalStore.addPendingBanner({
    text,
    bgColor: bgColor || 'green',
    textColor: textColor || 'white',
    key: uid(),
  })
}

export function notifyAxiosError(error: AxiosError, log = false) {
  if (log) console.log('error:', error)
  const options: QNotifyCreateOptions = {
    type: 'negative',
    position: 'top',
    actions: errorActions,
  }
  if (error.response === undefined) {
    options.message = 'Network Error'
  } else if (error.response.status === 500) {
    options.message = 'Server Error'
  } else if (error.response.status === 404) {
    options.message = '404 Not Found'
  } else if (error.response.status === 403) {
    options.message = error.response.data.detail
  } else {
    for (const [field, err] of Object.entries(error.response.data)) {
      if (Array.isArray(err)) {
        for (const msg of err) {
          options.message = `${field}: ${msg}`
          Notify.create(options)
        }
        return
      } else {
        options.message = `${field}: ${err}`
      }
    }
  }
  Notify.create(options)
}

export function notifyErrors(data: any) {
  for (const [field, error] of Object.entries(data)) {
    if (Array.isArray(error)) {
      for (const msg of error) {
        Notify.create({
          type: 'negative',
          message: `${field}: ${msg}`,
          position: 'top',
          actions: [
            {label: '', icon: 'close', color: 'white', round: true},
          ],
        })
      }
    } else {
      Notify.create({
        type: 'negative',
        message: `${field}: ${error}`,
        position: 'top',
        actions: [
          {label: '', icon: 'close', color: 'white', round: true},
        ],
      })
    }
  }
}

export function notifyMessage(
    type: string,
    msg: string,
    pos: QNotifyCreateOptions['position'] = 'top',
    btnColor = 'white',
) {
  Notify.create({
    type: type,
    message: msg,
    position: pos,
    actions: [
      {label: '', icon: 'close', color: btnColor, round: true},
    ],
  })
}
