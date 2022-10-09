import {ref, reactive} from 'vue'
import routesObj from '../../router/routes'

export const sidebarOpen = ref(true)

export const generalState = reactive({
  sideOpen: false,
})

export interface SideMenuRoute {
  routeName: string
  titleI18n: string
  permissions: string[]
  icon: string
}

function getRoute(route: string): SideMenuRoute {
  return {
    routeName: routesObj[route].name,
    titleI18n: routesObj[route].meta?.titleI18n,
    permissions: routesObj[route].meta?.permission || [],
    icon: routesObj[route].meta?.icon,
  }
}

export interface SidebarMenuList {
  icon: string,
  order: number,
  titleI18n: string,
  collapsed: boolean,
  children: SideMenuRoute[]
}

export const menuItems: Array<SidebarMenuList> = [
  {
    icon: 'mdi-warehouse',
    order: 20,
    titleI18n: 'general.routes.products',
    collapsed: false,
    children: [
      getRoute('brandList'),
      getRoute('productTypeList'),
      getRoute('actualProductList'),
      getRoute('productList'),
      // getRoute('productTypeSelectorList'),
      // getRoute('productTypeSelectorValueList'),
      getRoute('variantList'),
    ],
  },
  {
    icon: 'fab fa-android',
    order: 30,
    titleI18n: 'general.routes.robot',
    collapsed: false,
    children: [
      getRoute('editVariantStatus'),
      getRoute('editVariantStatusDKPC'),
      getRoute('inactiveVariants'),
      getRoute('digiCredentials'),
      getRoute('scrapeInvoice'),
      // getRoute('WebRTCTest'),
    ],
  },
  {
    icon: 'mdi-calculator',
    order: 40,
    titleI18n: 'acc.accounting',
    collapsed: false,
    children: [
      getRoute('invoiceList'),
      getRoute('costTypeList'),
      getRoute('costList'),
      getRoute('incomeList'),
      getRoute('productCostList'),
      getRoute('profitAllYear'),
      getRoute('profitByDate'),
    ],
  },
]
