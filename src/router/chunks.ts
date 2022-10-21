// User:
export const home = () => import('../pages/dashboard/Profile.vue')
export const login = () => import('../pages/auth/Login.vue')
export const logout = () => import('../pages/auth/Logout.vue')
export const profile = () => import('../pages/dashboard/Profile.vue')


// Products
export const actualProductsList = () => import('../pages/products/actualProduct/List.vue')
export const actualProductAddEdit = () => import('../pages/products/actualProduct/AddEdit.vue')

export const brandList = () => import('../pages/products/brand/List.vue')
export const brandAddEdit = () => import('../pages/products/brand/AddEdit.vue')

export const productsList = () => import('../pages/products/product/List.vue')
export const productAddEdit = () => import('../pages/products/product/AddEdit.vue')

export const productTypesList = () => import('../pages/products/productType/List.vue')
export const productTypeAddEdit = () => import('../pages/products/productType/AddEdit.vue')

// export const productTypeSelectorsList = () => import('../pages/products/productTypeSelector/List.vue')
// export const productTypeSelectorValuesList = () => import('../pages/products/productTypeSelectorValues/List.vue')


// Robot
export const variantsList = () => import('../pages/products/variant/List.vue')
export const variantAddEdit = () => import('../pages/products/variant/AddEdit.vue')
export const variantBulkCreate = () => import('../pages/products/variant/BulkCreate.vue')
export const editVariantStatus = () => import('pages/robot/variant/VariantStatus.vue')
export const editVariantStatusDKPC = () => import('pages/robot/variant/VariantStatusDkpc.vue')
export const digiCredentials = () => import('pages/robot/DigiCredentials.vue')
export const scrapeInvoice = () => import('pages/robot/ScrapeInvoice.vue')
export const inactiveVariants = () => import('pages/robot/InactiveVariants.vue')
export const WebRTCTest = () => import('pages/robot/WebRTCTest.vue')


// Accounting
export const invoiceList = () => import('../pages/accounting/invoice/List.vue')
export const invoiceDetails = () => import('../pages/accounting/invoice/Details.vue')

export const costList = () => import('../pages/accounting/cost/List.vue')
export const costAddEdit = () => import('../pages/accounting/cost/AddEdit.vue')

export const costTypeList = () => import('../pages/accounting/costType/List.vue')
export const costTypeAddEdit = () => import('../pages/accounting/costType/AddEdit.vue')

export const incomeList = () => import('../pages/accounting/income/List.vue')
export const incomeAddEdit = () => import('../pages/accounting/income/AddEdit.vue')

export const productCostList = () => import('../pages/accounting/productCost/List.vue')
export const productCostAddEdit = () => import('../pages/accounting/productCost/AddEdit.vue')

export const profitByDate = () => import('../pages/accounting/profit/ProfitByDate.vue')
export const profitAllYear = () => import('../pages/accounting/profit/ProfitAllYear.vue')


// Other:
export const justRain = () => import('../pages/JustRain.vue')
export const test = () => import('../pages/robot/test.vue')
