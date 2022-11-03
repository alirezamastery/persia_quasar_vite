import {defineStore} from 'pinia'
import {GlobalBanner} from 'src/types/general'

const storeID = 'general'

export type GeneralState = {
  httpRequestQueue: number,
  sidebarOpen: boolean,
  banners: GlobalBanner[],
  pendingBanners: GlobalBanner[],
  locale: string,
  tableFilterResetSignal: boolean,
}

export const useGeneralStore = defineStore({
  id: storeID,
  state: () => ({
    httpRequestQueue: 0,
    sidebarOpen: false,
    banners: [],
    pendingBanners: [],
    locale: 'fa',
    tableFilterResetSignal: false,
  } as GeneralState),
  getters: {
    hasHttpRequestWaiting(): boolean {
      return this.httpRequestQueue > 0
    },
  },
  actions: {
    clearHttpRequestQueue() {
      this.httpRequestQueue = 0
    },
    addPendingBanner(payload: GlobalBanner) {
      this.pendingBanners.push(payload)
    },
    clearPendingBanners() {
      this.pendingBanners = []
    },
    addBanner(banner: GlobalBanner) {
      this.banners.push(banner)
    },
    deleteBanner(banner: GlobalBanner) {
      const index = this.banners.findIndex(item => item.key === banner.key)
      if (index > -1)
        this.banners.splice(index, 1)
    },
    clearBanners() {
      this.banners = []
    },
    resetTableFilter() {
      this.tableFilterResetSignal = !this.tableFilterResetSignal
      console.log('this.tableFilterResetSignal', this.tableFilterResetSignal)
    },
  },
})

export default useGeneralStore
