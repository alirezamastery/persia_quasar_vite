import {RouteRecordRaw} from 'vue-router'
import * as views from './chunks'
import RouteNames from 'src/router/route-names'


const routesObj: { [index: string]: RouteRecordRaw } = {
  [RouteNames.HOME]: {
    path: '/',
    redirect: {name: RouteNames.EDIT_VARIANT_STATUS},
    meta: {requiresAuth: true},
    // children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  // #################### Auth ####################
  [RouteNames.LOGIN]: {
    path: '/login',
    component: views.login,
    meta: {
      guest: true,
    },
  },
  [RouteNames.LOGOUT]: {
    path: '/logout',
    meta: {
      requiresAuth: true,
    },
    component: views.logout,
  },
  [RouteNames.PROFILE]: {
    path: '/user/profile',
    component: views.profile,
    meta: {
      requiresAuth: true,
    },
  },
  // #################### Products App ####################
  // ********** Actual Products **********
  [RouteNames.ACTUAL_PRODUCTS_LIST]: {
    path: '/actual-products',
    component: views.actualProductsList,
    meta: {
      titleI18n: 'general.routes.actualProducts',
      icon: 'view_in_ar',
      requiresAuth: true,
    },
  },
  [RouteNames.ACTUAL_PRODUCTS_ADD]: {
    path: '/actual-products/add',
    component: views.actualProductAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.ACTUAL_PRODUCTS_EDIT]: {
    path: '/actual-products/edit/:id',
    component: views.actualProductAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Brands **********
  [RouteNames.BRAND_LIST]: {
    path: '/brands',
    component: views.brandList,
    meta: {
      titleI18n: 'general.routes.brands',
      icon: 'fab fa-apple',
      requiresAuth: true,
    },
  },
  [RouteNames.BRAND_ADD]: {
    path: '/brands/add',
    component: views.brandAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.BRAND_EDIT]: {
    path: '/brands/edit/:id',
    component: views.brandAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Products **********
  [RouteNames.PRODUCT_LIST]: {
    path: '/products',
    component: views.productsList,
    meta: {
      titleI18n: 'general.routes.products',
      icon: 'fas fa-cubes',
      requiresAuth: true,
    },
  },
  [RouteNames.PRODUCT_ADD]: {
    path: '/products/add',
    component: views.productAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.PRODUCT_EDIT]: {
    path: '/products/edit/:id',
    component: views.productAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Product Types **********
  [RouteNames.PRODUCT_TYPE_LIST]: {
    path: '/product-types',
    component: views.productTypesList,
    meta: {
      titleI18n: 'general.routes.productTypes',
      icon: 'category',
      requiresAuth: true,
    },
  },
  [RouteNames.PRODUCT_TYPE_ADD]: {
    path: '/product-types/add',
    component: views.productTypeAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.PRODUCT_TYPE_EDIT]: {
    path: '/product-types/edit/:id',
    component: views.productTypeAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Variants **********
  [RouteNames.VARIANT_LIST]: {
    path: '/variants',
    component: views.variantsList,
    meta: {
      titleI18n: 'general.routes.variants',
      icon: 'account_tree',
      requiresAuth: true,
    },
  },
  [RouteNames.VARIANT_ADD]: {
    path: '/variants/add',
    component: views.variantAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.VARIANT_EDIT]: {
    path: '/variants/edit/:id?',
    component: views.variantAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  variantBulkCreate: {
    path: '/variants/bulk-create',
    component: views.variantBulkCreate,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  // #################### Robot ####################
  // ********** Variant Status **********
  [RouteNames.EDIT_VARIANT_STATUS]: {
    path: '/robot/variant-status',
    component: views.editVariantStatus,
    meta: {
      titleI18n: 'general.routes.variantStatus',
      icon: 'find_in_page',
      requiresAuth: true,
    },
  },
  // ********** Variant Status DKPC**********
  [RouteNames.EDIT_VARIANT_STATUS_DKPC]: {
    path: '/robot/variant-status-dkpc',
    component: views.editVariantStatusDKPC,
    meta: {
      titleI18n: 'general.routes.variantStatusDKPC',
      icon: 'find_in_page',
      requiresAuth: true,
    },
  },
  // ********** Digi Credentials **********
  [RouteNames.DK_CREDENTIALS]: {
    path: '/robot/digi-creds',
    component: views.digiCredentials,
    meta: {
      titleI18n: 'general.routes.digiPassword',
      icon: 'pin',
      requiresAuth: true,
    },
  },
  // ********** Scrape Invoice **********
  [RouteNames.SCRAPE_INVOICE]: {
    path: '/robot/scrape-invoice',
    component: views.scrapeInvoice,
    meta: {
      titleI18n: 'general.routes.scrapeInvoice',
      icon: 'engineering',
      requiresAuth: true,
    },
  },
  // ********** Inactive Variants **********
  [RouteNames.INACTIVE_VARIANTS]: {
    path: '/robot/inactive-variants',
    component: views.inactiveVariants,
    meta: {
      titleI18n: 'general.routes.inactiveVariants',
      icon: 'power_off',
      requiresAuth: true,
    },
  },
  // ********** WebRTC Call **********
  [RouteNames.CONTACT_LIST]: {
    path: '/call/contact-list',
    component: views.ContactList,
    meta: {
      titleI18n: 'general.call',
      icon: 'call',
      requiresAuth: true,
    },
  },
  // ********** Toggle Variant Status **********
  [RouteNames.TOGGLE_VARIANT_STATUS]: {
    path: '/robot/toggle-variant-status',
    component: views.ToggleVariantStatus,
    meta: {
      titleI18n: 'general.routes.toggleVariantStatus',
      icon: 'fa fa-toggle-on',
      requiresAuth: true,
    },
  },

  // #################### Accounting ####################
  // ********** Invoice List **********
  [RouteNames.INVOICE_LIST]: {
    path: '/accounting/invoices',
    component: views.invoiceList,
    meta: {
      titleI18n: 'general.routes.invoices',
      icon: 'receipt_long',
      requiresAuth: true,
    },
  },
  // ********** Invoice Details **********
  [RouteNames.INVOICE_DETAILS]: {
    path: '/accounting/invoice/:id',
    component: views.invoiceDetails,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Cost **********
  [RouteNames.COST_LIST]: {
    path: '/accounting/costs',
    component: views.costList,
    meta: {
      titleI18n: 'acc.costs',
      icon: 'money_off',
      requiresAuth: true,
    },
  },
  [RouteNames.COST_ADD]: {
    path: '/accounting/costs/add',
    component: views.costAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.COST_EDIT]: {
    path: '/accounting/costs/edit/:id?',
    component: views.costAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Cost Type **********
  [RouteNames.COST_TYPE_LIST]: {
    path: '/accounting/cost-types',
    component: views.costTypeList,
    meta: {
      titleI18n: 'acc.costTypes',
      icon: 'price_change',
      requiresAuth: true,
    },
  },
  [RouteNames.COST_TYPE_ADD]: {
    path: '/accounting/costs-types/add',
    component: views.costTypeAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.COST_TYPE_EDIT]: {
    path: '/accounting/costs-types/edit/:id?',
    component: views.costTypeAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Income **********
  [RouteNames.INCOME_LIST]: {
    path: '/accounting/income',
    component: views.incomeList,
    meta: {
      titleI18n: 'acc.incomes',
      icon: 'attach_money',
      requiresAuth: true,
    },
  },
  [RouteNames.INCOME_ADD]: {
    path: '/accounting/income/add',
    component: views.incomeAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.INCOME_EDIT]: {
    path: '/accounting/income/edit/:id?',
    component: views.incomeAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Product Cost **********
  [RouteNames.PRODUCT_COST_LIST]: {
    path: '/accounting/product-cost',
    component: views.productCostList,
    meta: {
      titleI18n: 'acc.productCosts',
      icon: 'shopping_cart',
      requiresAuth: true,
    },
  },
  [RouteNames.PRODUCT_COST_ADD]: {
    path: '/accounting/product-cost/add',
    component: views.productCostAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.PRODUCT_COST_EDIT]: {
    path: '/accounting/product-cost/edit/:id?',
    component: views.productCostAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  [RouteNames.TEST_PAGE]: {
    path: '/test',
    component: views.test,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Profit **********
  [RouteNames.PROFIT_BY_DATE]: {
    path: '/profit-by-date',
    component: views.profitByDate,
    props: true,
    meta: {
      titleI18n: 'acc.profit',
      icon: 'fab fa-ethereum',
      requiresAuth: true,
    },
  },
  [RouteNames.PROFIT_ALL_YEAR]: {
    path: '/profit-all-year',
    component: views.profitAllYear,
    props: true,
    meta: {
      titleI18n: 'acc.profitYearView',
      icon: 'fas fa-chart-bar',
      requiresAuth: true,
    },
  },

  // #################### Other ####################
  // ********** Matrix Rain **********
  [RouteNames.JUST_RAIN]: {
    path: '/just-rain',
    component: views.justRain,
  },

  // Always leave this as last one,
  // but you can also remove it
  [RouteNames.ERROR_404]: {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
}


for (const [key, value] of Object.entries(routesObj)) {
  value.name = key
}

export default routesObj
