import {PushNotifications} from '@capacitor/push-notifications'
import {logger} from 'src/utils'


const addFireBaseListeners = () => {
  PushNotifications.addListener('registration', token => {
    logger('Registration token: ', token.value)
  })

  PushNotifications.addListener('registrationError', err => {
    logger('Registration error: ', err.error)
  })

  PushNotifications.addListener('pushNotificationReceived', notification => {
    logger('Push notification received: ', String(notification))
  })

  PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    logger('Push notification action performed', notification.actionId, String(notification.inputValue))
  })
}

const registerNotifications = () => {
  PushNotifications.checkPermissions().then(permStatus => {
    logger('PushNotifications permission status:', permStatus.receive)
    if (permStatus.receive === 'prompt') {
      PushNotifications.requestPermissions().then(permStatus => {
        if (permStatus.receive !== 'granted') {
          throw new Error('User denied permissions!')
        }
        logger('register PushNotifications')
        PushNotifications.register()
      })
    }
    logger('register PushNotifications')
    PushNotifications.register()
  })
}

const getDeliveredNotifications = () => {
  PushNotifications.getDeliveredNotifications().then(notificationList => {
    logger('delivered notifications', String(notificationList))
  })
}

export const firebaseSetup = () => {
  logger('Firebase Setup')
  registerNotifications()
  addFireBaseListeners()
  getDeliveredNotifications()
}
