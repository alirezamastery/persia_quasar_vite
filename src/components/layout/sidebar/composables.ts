import {ref, reactive} from 'vue'
import routesObj from 'src/router/routes'
import {RouteRecordName} from 'vue-router'
import RouteNames from 'src/router/route-names'

export const sidebarOpen = ref(true)

export const generalState = reactive({
  sideOpen: false,
})

export interface SideMenuRoute {
  routeName?: RouteRecordName
  titleI18n: string
  permissions: string[]
  icon: string
}

function getRoute(route: string): SideMenuRoute {
  return {
    routeName: routesObj[route].name,
    titleI18n: routesObj[route].meta?.titleI18n as string,
    permissions: routesObj[route].meta?.permission as string[] || [],
    icon: routesObj[route].meta?.icon as string,
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
      getRoute(RouteNames.BRAND_LIST),
      getRoute(RouteNames.PRODUCT_TYPE_LIST),
      getRoute(RouteNames.ACTUAL_PRODUCTS_LIST),
      getRoute(RouteNames.PRODUCT_LIST),
      // getRoute('productTypeSelectorList'),
      // getRoute('productTypeSelectorValueList'),
      getRoute(RouteNames.VARIANT_LIST),
      getRoute(RouteNames.TOGGLE_VARIANT_STATUS),
    ],
  },
  {
    icon: 'fab fa-android',
    order: 30,
    titleI18n: 'general.routes.robot',
    collapsed: false,
    children: [
      getRoute(RouteNames.EDIT_VARIANT_STATUS),
      getRoute(RouteNames.EDIT_VARIANT_STATUS_DKPC),
      getRoute(RouteNames.INACTIVE_VARIANTS),
      getRoute(RouteNames.DK_CREDENTIALS),
      getRoute(RouteNames.SCRAPE_INVOICE),
      getRoute(RouteNames.CONTACT_LIST),
    ],
  },
  {
    icon: 'mdi-calculator',
    order: 40,
    titleI18n: 'acc.accounting',
    collapsed: false,
    children: [
      getRoute(RouteNames.INVOICE_LIST),
      getRoute(RouteNames.COST_TYPE_LIST),
      getRoute(RouteNames.COST_LIST),
      getRoute(RouteNames.INCOME_LIST),
      getRoute(RouteNames.PRODUCT_COST_LIST),
      getRoute(RouteNames.PROFIT_ALL_YEAR),
      getRoute(RouteNames.PROFIT_BY_DATE),
    ],
  },
]
