import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { useCartStore } from '../store/cartStore';
import type { Discount } from '../types';
import { DiscountForm } from './DiscountForm';

export const DiscountList: React.FC = () => {
  const { discounts, addDiscount, updateDiscount, removeDiscount, toggleDiscount } = useCartStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const handleAddDiscount = (discountData: Omit<Discount, 'id' | 'createdAt' | 'isEnabled'>) => {
    addDiscount(discountData);
    setIsFormOpen(false);
  };

  const handleEditDiscount = (discountData: Omit<Discount, 'id' | 'createdAt' | 'isEnabled'>) => {
    if (editingDiscount) {
      updateDiscount(editingDiscount.id, discountData);
      setEditingDiscount(null);
    }
  };

  const handleEditClick = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsFormOpen(true);
  };

  const formatDiscountValue = (discount: Discount) => {
    if (discount.type === 'percentage') {
      return `- ${discount.value} % ${discount.priceType === 'onetime' ? 'one time' : 'monthly'}`;
    } else {
      return `- € ${discount.value.toFixed(2)} ${discount.priceType === 'onetime' ? 'one time' : 'monthly'}`;
    }
  };

  const formatDiscountDetails = (discount: Discount) => {
    let details = formatDiscountValue(discount);

    if (discount.priceType === 'monthly' && discount.duration) {
      details += ` first ${discount.duration} months`;
    }

    return details;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="bg-[rgb(38,183,205)] text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-lg font-medium">Discounts</h2>
      </div>

      <div className="p-6">
        <button
          onClick={() => {
            setEditingDiscount(null);
            setIsFormOpen(true);
          }}
          className="text-[rgb(38,183,205)] font-medium hover:text-teal-600 transition-colors flex items-center justify-end space-x-2 mb-6 ml-auto"
          >
          <Plus size={16} />
          <span>Add manual discount</span>
        </button>
        <hr className="mb-6 border-gray-200"></hr>
        <div className="space-y-4">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">Discount name</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-sm">
                      {formatDiscountDetails(discount)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(discount)}
                        className="p-1 text-[rgb(38,183,205)] hover:text-teal-600 transition-colors"
                        title="Edit discount"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeDiscount(discount.id)}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete discount"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Switch
                        checked={discount.isEnabled}
                        onChange={() => toggleDiscount(discount.id)}
                        className={`${discount.isEnabled ? 'bg-[rgb(38,183,205)]' : 'bg-gray-200'
                          } relative inline-flex h-5 w-9 items-center rounded transition-colors focus:outline-none`}
                      >
                        <span className="sr-only">Enable discount</span>
                        <span
                          className={`${discount.isEnabled ? 'translate-x-5' : 'translate-x-1'
                            } inline-block h-3 w-3 transform rounded bg-white transition-transform`}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
                <hr className="mt-5 border-gray-200"></hr>
              </div>
            </div>
          ))}

          {discounts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No discounts added yet.</p>
              <p className="text-sm">Click "Add manual discount" to get started.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8 pt-4 border-gray-200">
          <button className="text-[rgb(38,183,205)] hover:text-teal-600 font-medium transition-colors">
            Previous
          </button>
          <button className="px-6 py-2 bg-[rgb(38,183,205)] hover:bg-teal-600 text-white font-medium rounded-md transition-colors">
            Next
          </button>
        </div>
      </div>

      <DiscountForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDiscount(null);
        }}
        onSubmit={editingDiscount ? handleEditDiscount : handleAddDiscount}
        editingDiscount={editingDiscount}
      />
    </div>
  );
};