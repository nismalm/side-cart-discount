import React from 'react';
import { useCartStore } from '../store/cartStore';

export const SideCart: React.FC = () => {
  const { cartItems, discounts, calculatePrices } = useCartStore();
  const priceCalculation = calculatePrices();

  const product = cartItems[0]?.product;
  if (!product) return null;

  const formatCurrency = (amount: number) => `€ ${amount.toFixed(2)}`;

  const getAppliedDiscounts = () => {
    const enabledDiscounts = discounts.filter(d => d.isEnabled);
    const onetimeDiscounts = enabledDiscounts.filter(d => d.priceType === 'onetime');
    const monthlyDiscounts = enabledDiscounts.filter(d => d.priceType === 'monthly');
    
    return { onetimeDiscounts, monthlyDiscounts };
  };

  const { onetimeDiscounts, monthlyDiscounts } = getAppliedDiscounts();

  return (
    <div className="w-80 bg-white shadow-sm h-fit">
      <div className="p-0">
        <h3 className="text-lg font-semibold text-gray-500 p-4">Overview</h3>
        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
            <img src={product.image} alt={product.name} className="w-full h-full object-fill rounded-md" />
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-lg p-2 mb-4">
          <div className="text-left space-y-2">
            <div className='flex justify-between items-center'>
            <h4 className="font-medium text-gray-900 text-base px-4 leading-tight">
              {product.name}
            </h4>
            <div className="font-medium text-gray-900 text-base">
                  {formatCurrency(product.onetimePrice)}
                </div>
            </div>
            <div className='flex justify-between items-center'>
              <p className="text-sm text-gray-500 italic px-4">Monthly Price</p>
              <div className="text-sm text-gray-500">
                  {formatCurrency(product.monthlyPrice)}
              </div>
            </div>
            <button className="text-[rgb(38,183,205)] text-sm hover:text-teal-600 transition-colors px-4">
              Edit
            </button>
            {/* <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-900"></span>
              <div className="text-right">
                <div className="font-medium text-gray-900 text-base">
                  {formatCurrency(product.onetimePrice)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(product.monthlyPrice)}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Monthly Pricing */}
        <div className="mb-6 bg-[#EDF6FB] py-5 px-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Eventually per month excl. btw
            </span>
            <span className="font-medium text-gray-900 text-sm">
              {formatCurrency(priceCalculation.finalMonthlyPrice)}
            </span>
          </div>

        {/* Monthly Discounts with Duration */}
        {monthlyDiscounts.some(d => d.duration && d.duration > 0) && (
          <div>
            {monthlyDiscounts
              .filter(d => d.duration && d.duration > 0)
              .map(discount => (
                <div key={discount.id} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      First {discount.duration} months (with discount)
                    </span>
                    <span className="text-gray-900">
                      {formatCurrency(priceCalculation.monthlyPriceFirst3Months || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Remaining {12 - (discount.duration || 0)} months
                    </span>
                    <span className="text-gray-900">
                      {formatCurrency(priceCalculation.monthlyPriceRemaining9Months || product.monthlyPrice)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
        </div>
        <hr className="border-white mb-2" />

        {/* One-time Costs */}
        <div className="space-y-3 mb-6 bg-[#EDF6FB] py-5 px-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal onetime costs excl. btw</span>
            <span className="text-sm text-gray-900">
              {formatCurrency(priceCalculation.subtotalOnetime)}
            </span>
          </div>

          {/* One-time Discounts */}
          {onetimeDiscounts.map((discount) => (
            <div key={discount.id} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 italic">Discount name</span>
              <span className="text-sm text-gray-900">
                - {formatCurrency(
                  discount.type === 'percentage' 
                    ? priceCalculation.subtotalOnetime * discount.value / 100
                    : discount.value
                )}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center font-medium pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-900">Onetime costs excl. btw</span>
            <span className="text-sm text-gray-900">
              {formatCurrency(priceCalculation.finalOnetimePrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};