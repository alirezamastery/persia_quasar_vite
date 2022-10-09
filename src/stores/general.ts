import {defineStore} from 'pinia'
import {GlobalBanner} from 'src/types'

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
    IncrementHttpRequestQueue() {
      this.httpRequestQueue++
    },
    DecrementHttpRequestQueue() {
      this.httpRequestQueue--
      if (this.httpRequestQueue < 0)
        this.httpRequestQueue = 0
    },
    ClearHttpRequestQueue() {
      this.httpRequestQueue = 0
    },
    AddPendingBanner(payload: GlobalBanner) {
      this.pendingBanners.push(payload)
    },
    ClearPendingBanners() {
      this.pendingBanners = []
    },
    AddBanner(banner: GlobalBanner) {
      this.banners.push(banner)
    },
    DeleteBanner(banner: GlobalBanner) {
      const index = this.banners.findIndex(item => item.key === banner.key)
      if (index > -1)
        this.banners.splice(index, 1)
    },
    ClearBanners() {
      this.banners = []
    },
    ResetTableFilter() {
      this.tableFilterResetSignal = !this.tableFilterResetSignal
      console.log('this.tableFilterResetSignal', this.tableFilterResetSignal)
    },
  },
})

export default useGeneralStore
