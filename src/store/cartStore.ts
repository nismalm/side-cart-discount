import { create } from 'zustand';
import type { Discount, Product, CartItem, PriceCalculation } from '../types';
import productImage from '../assets/img/dummyProduct.png';

interface CartState {
  cartItems: CartItem[];
  discounts: Discount[];
  selectedProduct: Product;
  
  // Actions
  addDiscount: (discount: Omit<Discount, 'id' | 'createdAt' | 'isEnabled'>) => void;
  updateDiscount: (id: string, discount: Omit<Discount, 'id' | 'createdAt' | 'isEnabled'>) => void;
  removeDiscount: (id: string) => void;
  toggleDiscount: (id: string) => void;
  calculatePrices: () => PriceCalculation;
}

// Demo sample product
const defaultProduct: Product = {
  id: '1',
  name: 'Webasto Pure II ',
  onetimePrice: 1000.00,
  monthlyPrice: 10.00,
  image: productImage
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [{ product: defaultProduct, quantity: 1 }],
  discounts: [],
  selectedProduct: defaultProduct,

  addDiscount: (discountData) => {
    const newDiscount: Discount = {
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      isEnabled: true,
      ...discountData
    };
    
    set((state) => ({
      discounts: [...state.discounts, newDiscount]
    }));
  },

  updateDiscount: (id, discountData) => {
    set((state) => ({
      discounts: state.discounts.map(discount => 
        discount.id === id 
          ? { ...discount, ...discountData }
          : discount
      )
    }));
  },

  removeDiscount: (id) => {
    set((state) => ({
      discounts: state.discounts.filter(discount => discount.id !== id)
    }));
  },

  toggleDiscount: (id) => {
    set((state) => ({
      discounts: state.discounts.map(discount => 
        discount.id === id 
          ? { ...discount, isEnabled: !discount.isEnabled }
          : discount
      )
    }));
  },

  calculatePrices: (): PriceCalculation => {
    const { cartItems, discounts } = get();
    
    // base price calculations
    const subtotalOnetime = cartItems.reduce((sum, item) => 
      sum + (item.product.onetimePrice * item.quantity), 0
    );
    
    const subtotalMonthly = cartItems.reduce((sum, item) => 
      sum + (item.product.monthlyPrice * item.quantity), 0
    );

    // only apply enabled discounts
    const enabledDiscounts = discounts.filter(d => d.isEnabled);
    const onetimeDiscounts = enabledDiscounts.filter(d => d.priceType === 'onetime');
    const monthlyDiscounts = enabledDiscounts.filter(d => d.priceType === 'monthly');

    const totalDiscountOnetime = onetimeDiscounts.reduce((sum, discount) => {
      if (discount.type === 'percentage') {
        return sum + (subtotalOnetime * discount.value / 100);
      } else {
        return sum + discount.value;
      }
    }, 0);

    const totalDiscountMonthly = monthlyDiscounts.reduce((sum, discount) => {
      if (discount.type === 'percentage') {
        return sum + (subtotalMonthly * discount.value / 100);
      } else {
        return sum + discount.value;
      }
    }, 0);

    const finalOnetimePrice = Math.max(0, subtotalOnetime - totalDiscountOnetime);
    const finalMonthlyPrice = Math.max(0, subtotalMonthly - totalDiscountMonthly);

    // handle the monthly duration calculations
    let monthlyPriceFirst3Months: number | undefined;
    let monthlyPriceRemaining9Months: number | undefined;

    const monthlyDiscountsWithDuration = monthlyDiscounts.filter(d => d.duration && d.duration > 0);
    
    if (monthlyDiscountsWithDuration.length > 0) {
      // Calculate discounted price for the first 3 months (or less if discount duration is shorter)
      const discountedMonthlyPrice = monthlyDiscountsWithDuration.reduce((price, discount) => {
        if (discount.type === 'percentage') {
          return price - (subtotalMonthly * discount.value / 100);
        } else {
          return price - discount.value;
        }
      }, subtotalMonthly);

      monthlyPriceFirst3Months = Math.max(0, discountedMonthlyPrice);
      monthlyPriceRemaining9Months = subtotalMonthly; // Regular price for remaining months
    }

    return {
      subtotalOnetime,
      subtotalMonthly,
      totalDiscountOnetime,
      totalDiscountMonthly,
      finalOnetimePrice,
      finalMonthlyPrice,
      monthlyPriceFirst3Months,
      monthlyPriceRemaining9Months
    };
  }
}));