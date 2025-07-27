export type DiscountType = 'percentage' | 'fixed';
export type PriceType = 'onetime' | 'monthly';

export interface Discount {
  id: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  priceType: PriceType;
  duration?: number;
  isEnabled: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  onetimePrice: number;
  monthlyPrice: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PriceCalculation {
  subtotalOnetime: number;
  subtotalMonthly: number;
  totalDiscountOnetime: number;
  totalDiscountMonthly: number;
  finalOnetimePrice: number;
  finalMonthlyPrice: number;
  monthlyPriceFirst3Months?: number;
  monthlyPriceRemaining9Months?: number;
}