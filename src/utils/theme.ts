import {Dark, LocalStorage} from 'quasar'
import {StorageKeys} from 'src/utils/storage'

export function handleThemeToggle() {
  Dark.toggle()
  LocalStorage.set(StorageKeys.IS_DARK, Dark.isActive)
}
