import {register} from 'register-service-worker'
import {Notify, Dialog} from 'quasar'
import {i18n} from 'boot/i18n'
import {BroadcastTypes} from 'src/utils/broadcast'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(/* registration */) {
    console.log('Service worker is active.')
  },

  registered(/* registration */) {
    console.log('Service worker has been registered.')
  },

  cached(/* registration */) {
    console.log('Content has been cached for offline use.')
  },

  updatefound(/* registration */) {
    console.log('New content is downloading.')
  },

  updated(/* registration */) {
    console.log('New content is available; please refresh.')
    const {t} = i18n.global
    Notify.create({
      type: 'warning',
      position: 'top',
      message: t('general.pwaNewContent'),
      timeout: 0,
      classes: 'sw-update-notif',
      actions: [
        {label: t('general.cancel'), icon: 'close', color: 'red', flat: false},
        {
          label: t('general.refreshScreen'),
          icon: 'refresh',
          color: 'green',
          flat: false,
          handler: () => {
            const broadcast = new BroadcastChannel('persia_atlas')
            broadcast.postMessage({type: BroadcastTypes.SW_NEW_CONTENT, payload: {}})
          },
        },
      ],
    })

    // Dialog.create({
    //   message: t('general.pwaNewContent'),
    //   persistent: true,
    //   cancel: false,
    //   ok: {title: t('general.refreshScreen')},
    // }).onOk(() => {
    //   const broadcast = new BroadcastChannel('persia_atlas')
    //   broadcast.postMessage({type: BroadcastTypes.SW_NEW_CONTENT, payload: {}})
    // })
  },

  offline() {
    console.log('No internet connection found. App is running in offline mode.')
  },

  error(err) {
    console.error('Error during service worker registration:', err)
  },
})
