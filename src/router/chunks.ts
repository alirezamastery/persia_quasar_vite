export const home = () =>
  import(/* webpackChunkName: "general" */ '../pages/dashboard/Profile.vue')
export const login = () =>
  import(/* webpackChunkName: "general" */ '../pages/auth/Login.vue')
export const logout = () =>
  import(/* webpackChunkName: "general" */ '../pages/auth/Logout.vue')
export const profile = () =>
  import(/* webpackChunkName: "general" */ '../pages/dashboard/Profile.vue')
export const justRain = () =>
  import(/* webpackChunkName: "general" */ '../pages/JustRain.vue')
export const test = () =>
  import(/* webpackChunkName: "general" */ '../pages/robot/test.vue')

export const actualProductsList = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/actualProduct/List.vue')
export const actualProductAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/actualProduct/AddEdit.vue')

export const brandList = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/brand/List.vue')
export const brandAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/brand/AddEdit.vue')

export const productsList = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/product/List.vue')
export const productAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/product/AddEdit.vue')

export const productTypesList = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/productType/List.vue')
export const productTypeAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/productType/AddEdit.vue')

// export const productTypeSelectorsList = () =>
//   import(/* webpackChunkName: "products" */ '../pages/products/productTypeSelector/List.vue')
// export const productTypeSelectorValuesList = () =>
//   import(/* webpackChunkName: "products" */ '../pages/products/productTypeSelectorValues/List.vue')

export const variantsList = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/variant/List.vue')
export const variantAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/variant/AddEdit.vue')
export const variantBulkCreate = () =>
  import(/* webpackChunkName: "products" */ '../pages/products/variant/BulkCreate.vue')

export const editVariantStatus = () =>
  import(/* webpackChunkName: "robot" */ '../pages/robot/variantStatus/EditStatus.vue')

export const editVariantStatusDKPC = () =>
  import(/* webpackChunkName: "robot" */ '../pages/robot/variantStatusDKPC/Status.vue')

export const digiCredentials = () =>
  import(/* webpackChunkName: "robot" */ '../pages/robot/digiCredentials/DigiCredentials.vue')

export const scrapeInvoice = () =>
  import(/* webpackChunkName: "robot" */ '../pages/robot/scrapeInvoice/scrape.vue')

export const inactiveVariants = () =>
  import(/* webpackChunkName: "robot" */ '../pages/robot/inactiveVariants/List.vue')

export const WebRTCTest = () =>
  import(/* webpackChunkName: "robot" */ '../pages/robot/call/WebRTCTest.vue')


export const invoiceList = () =>
  import(/* webpackChunkName: "robot" */ '../pages/accounting/invoice/List.vue')
export const invoiceDetails = () =>
  import(/* webpackChunkName: "robot" */ '../pages/accounting/invoice/Details.vue')

export const costList  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/cost/List.vue')
export const costAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/cost/AddEdit.vue')

export const costTypeList  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/costType/List.vue')
export const costTypeAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/costType/AddEdit.vue')

export const incomeList  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/income/List.vue')
export const incomeAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/income/AddEdit.vue')

export const productCostList  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/productCost/List.vue')
export const productCostAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/productCost/AddEdit.vue')

export const profitByDate  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/profit/ProfitByDate.vue')
export const profitAllYear  = () =>
  import(/* webpackChunkName: "accounting" */ '../pages/accounting/profit/ProfitAllYear.vue')
