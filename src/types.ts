export interface GlobalBanner {
  text: string,
  bgColor: string,
  textColor: string,
  key: string,
}

export interface UserProfile {
  first_name: string | null,
  last_name: string | null,
  avatar: string | null,
}

export interface WebsocketCommand {
  command: number,
  req_key: string,
  payload?: { [key: string]: unknown }
}

export interface WebsocketBaseResponse {
  type: string,
  data: unknown,
  req_key: string
}

export interface WebsocketErrorResponse extends WebsocketBaseResponse {
  type: string,
  data: string
}

export interface VariantSelectorType {
  id: number,
  title: string
}

export interface VariantSelector {
  id: number,
  digikala_id: number,
  extra_info: string | null,
  value: string,
  selector_type: VariantSelectorType
}

export interface ProductType {
  id: number,
  title: string,
  selector_type: VariantSelectorType,
}

export interface Product {
  id: number,
  dkp: string,
  is_active: boolean,
  title: string,
  type: ProductType
}

export interface Brand {
  id: number,
  title: string
}

export interface ActualProduct {
  id: number,
  title: string,
  price_step: number,
  brand: Brand,
}

export interface Variant {
  id: number,
  dkpc: number,
  price_min: number,
  stop_loss: number,
  is_active: boolean,
  has_competition: boolean,
  product: Product,
  selector: VariantSelector,
  actual_product: ActualProduct,
}

export interface VariantDk extends Variant {
  dk: VariantDigikala
}

export interface VariantDigikala {
  id: number;
  seller_id: number;
  site: string;
  is_active: boolean;
  is_archived: boolean;
  title: string;
  product: Product;
  shipping_type: string;
  supplier_code: null;
  dk_lead_time: number;
  sbs_lead_time: number;
  stock: Stock;
  price: Price;
  consignment_cap: null;
  fulfilment_and_delivery_cost: number;
  extra: Extra;
}

export interface Extra {
  gold_price_parameters: null;
  buy_box: BuyBox;
  promotion_data: PromotionData;
  selling_channels: SellingChannels;
  b2b_params: B2BParams;
  shipping_options: ShippingOptions;
}

export interface B2BParams {
  seller_b2b_active: boolean;
  is_only_b2b: boolean;
  is_b2b_active: boolean;
  b2b_prices: any[];
}

export interface BuyBox {
  buy_box_price: number;
  is_buy_box_winner: boolean;
  is_seller_buy_box_winner: boolean;
  is_in_buy_box_challenge: boolean;
  min_selling_price_limit: number;
}

export interface PromotionData {
  is_incredible_promotion: boolean;
  is_in_promotion: boolean;
  promo_price: string;
  is_promotion_management_visible_for_seller: boolean;
}

export interface SellingChannels {
  product_selling_channel: TSellingChannel;
  variant_selling_channel: TSellingChannel;
}

export interface TSellingChannel {
  active_digikala: boolean;
  active_digistyle: boolean;
}

export interface ShippingOptions {
  is_fbs_ability_enable: boolean;
  is_fbd_active: boolean;
  is_fbs_active: boolean;
}

export interface Price {
  id: number;
  selling_price: number;
  rrp_price: number;
  discount: number;
  order_limit: number;
  is_promotion_price: boolean;
  tags: null;
}

export interface Product {
  id: number;
  category_id: number;
  title: string;
  image: string;
  category_name_fa: string;
  category_name_en: string;
  moderation_status: string;
}

export interface Stock {
  seller_stock: number;
  dk_stock: number;
  seller_reserved_stock: number;
  dk_reserved_stock: number;
  selling_stock: number;
}

export interface InactiveVariantsResponse {
  total_count: number,
  items: VariantDigikala[]
}
