import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ discounts: [] });
  });

  it('should add a discount', () => {
    const { addDiscount } = useCartStore.getState();
    
    addDiscount({
      name: 'Test Discount',
      type: 'percentage',
      value: 10,
      priceType: 'onetime'
    });

    const updatedDiscounts = useCartStore.getState().discounts;
    expect(updatedDiscounts).toHaveLength(1);
    expect(updatedDiscounts[0].name).toBe('Test Discount');
    expect(updatedDiscounts[0].value).toBe(10);
  });

  it('should remove a discount', () => {
    const { addDiscount, removeDiscount } = useCartStore.getState();
    
    addDiscount({
      name: 'Test Discount',
      type: 'percentage',
      value: 10,
      priceType: 'onetime'
    });

    const discounts = useCartStore.getState().discounts;
    const discountId = discounts[0].id;
    
    removeDiscount(discountId);
    
    const updatedDiscounts = useCartStore.getState().discounts;
    expect(updatedDiscounts).toHaveLength(0);
  });

  it('should calculate prices correctly with percentage discount', () => {
    const { addDiscount, calculatePrices } = useCartStore.getState();
    
    addDiscount({
      name: 'Test Discount',
      type: 'percentage',
      value: 10,
      priceType: 'onetime'
    });

    const prices = calculatePrices();
    
    expect(prices.subtotalOnetime).toBe(1000);
    expect(prices.totalDiscountOnetime).toBe(100);
    expect(prices.finalOnetimePrice).toBe(900);
  });

  it('should calculate prices correctly with fixed discount', () => {
    const { addDiscount, calculatePrices } = useCartStore.getState();
    
    addDiscount({
      name: 'Test Discount',
      type: 'fixed',
      value: 250,
      priceType: 'onetime'
    });

    const prices = calculatePrices();
    
    expect(prices.subtotalOnetime).toBe(1000);
    expect(prices.totalDiscountOnetime).toBe(250);
    expect(prices.finalOnetimePrice).toBe(750);
  });

  it('should handle monthly discount with duration', () => {
    const { addDiscount, calculatePrices } = useCartStore.getState();
    
    addDiscount({
      name: 'Monthly Discount',
      type: 'fixed',
      value: 5,
      priceType: 'monthly',
      duration: 3
    });

    const prices = calculatePrices();
    
    expect(prices.monthlyPriceFirst3Months).toBe(5);
    expect(prices.monthlyPriceRemaining9Months).toBe(10);
  });
});