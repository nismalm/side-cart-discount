import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Discount, DiscountType, PriceType } from '../types';

interface DiscountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discount: Omit<Discount, 'id' | 'createdAt' | 'isEnabled'>) => void;
  editingDiscount?: Discount | null;
}

export const DiscountForm: React.FC<DiscountFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingDiscount
}) => {
  const [priceType, setPriceType] = useState<PriceType>('monthly');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [value, setValue] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const calculateNewPrice = () => {
    const basePrice = priceType === 'onetime' ? 1000.00 : 10.00;
    const discountValue = parseFloat(value) || 0;

    if (discountType === 'percentage') {
      return Math.max(0, basePrice - (basePrice * discountValue / 100));
    } else {
      return Math.max(0, basePrice - discountValue);
    }
  };

  const validateDiscount = (inputValue: string) => {
    const basePrice = priceType === 'onetime' ? 1000.00 : 10.00;
    const discountValue = parseFloat(inputValue) || 0;
    
    if (discountValue <= 0) {
      setError(''); // clear any existing error
      return true;
    }
    
    if (discountType === 'percentage') {
      if (discountValue > 100) {
        setError('Percentage discount cannot exceed 100%');
        return false;
      }
    } else {
      if (discountValue > basePrice) {
        setError(`Fixed discount cannot exceed ${priceType === 'onetime' ? '€1000.00' : '€10.00'}`);
        return false;
      }
    }
    
    setError('');
    return true;
  };

  useEffect(() => {
    if (editingDiscount) {
      setPriceType(editingDiscount.priceType);
      setDiscountType(editingDiscount.type);
      setValue(editingDiscount.value.toString());
      setDuration(editingDiscount.duration?.toString() || '');
      setDescription(editingDiscount.description || '');
    } else {
      setPriceType('monthly');
      setDiscountType('percentage');
      setValue('');
      setDuration('');
      setDescription('');
      setError('');
    }
  }, [editingDiscount, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) return;
    
    if (!validateDiscount(value)) return;

    onSubmit({
      name: `${value}${discountType === 'percentage' ? '%' : '€'} discount`,
      description: description.trim() || undefined,
      type: discountType,
      value: parseFloat(value),
      priceType,
      duration: priceType === 'monthly' && duration ? parseInt(duration) : undefined
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingDiscount ? 'Discount name here' : 'Add discount'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                For which price do you calculate the discount?
              </label>
              <div className="flex space-x-1 w-[60%]">
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('onetime');
                    if (value) validateDiscount(value);
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${priceType === 'onetime'
                      ? 'bg-[rgb(38,183,205)] text-white rounded-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md'
                    }`}
                >
                  <span>One time price</span>
                  <span className="rounded-full p-2 bg-white">{priceType === 'onetime' && <Check stroke='rgb(38,183,205)' strokeWidth={4} size={12} />}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('monthly');
                    if (value) validateDiscount(value);
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${priceType === 'monthly'
                      ? 'bg-[rgb(38,183,205)] text-white rounded-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md'
                    }`}
                >
                  <span>Monthly price</span>
                  <span className="rounded-full p-2 bg-white">{priceType === 'monthly' && <Check stroke='rgb(38,183,205)' strokeWidth={4} size={12} />}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <div className="flex space-x-2">
                <select
                  value={discountType}
                  onChange={(e) => {
                    setDiscountType(e.target.value as DiscountType);
                    if (value) validateDiscount(value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(38,183,205)] focus:border-transparent bg-white text-sm"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">€</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={discountType === 'percentage' ? 100 : (priceType === 'onetime' ? 1000 : 10)}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    validateDiscount(e.target.value);
                  }}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                    error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[rgb(38,183,205)]'
                  }`}
                  placeholder=""
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {priceType === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(38,183,205)] focus:border-transparent text-sm"
                    placeholder=""
                  />
                  <span className="text-sm text-gray-600">months</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New price
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
                € {calculateNewPrice().toFixed(2)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(38,183,205)] focus:border-transparent text-sm resize-none"
                placeholder=""
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[rgb(38,183,205)] hover:text-teal-600 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!!error || !value.trim()}
                className={`px-6 py-2 font-medium rounded-md transition-colors ${
                  error || !value.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[rgb(38,183,205)] hover:bg-teal-600 text-white'
                }`}
              >
                {editingDiscount ? 'Save' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};