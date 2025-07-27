import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscountForm } from '../components/DiscountForm';

describe('DiscountForm', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form when open', () => {
    render(
      <DiscountForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Add manual discount')).toBeInTheDocument();
    expect(screen.getByText('For which price do you calculate the discount?')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <DiscountForm
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Add manual discount')).not.toBeInTheDocument();
  });

  it('should submit form with correct data', async () => {
    const user = userEvent.setup();
    
    render(
      <DiscountForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const discountInputs = screen.getAllByRole('spinbutton');
    const discountValueInput = discountInputs.find(input => input.hasAttribute('required'));
    
    if (discountValueInput) {
      await user.type(discountValueInput, '10');
    }
    await user.type(screen.getByPlaceholderText('Number of months'), '3');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: '10% discount',
        type: 'percentage',
        value: 10,
        priceType: 'monthly',
        duration: 3,
        description: undefined
      });
    });
  });

  it('should switch between price types', async () => {
    const user = userEvent.setup();
    
    render(
      <DiscountForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const onetimeButton = screen.getByRole('button', { name: 'One time price' });
    await user.click(onetimeButton);

    expect(screen.queryByPlaceholderText('Number of months')).not.toBeInTheDocument();
  });

  it('should populate form when editing', () => {
    const editingDiscount = {
      id: '1',
      name: 'Existing Discount',
      type: 'fixed' as const,
      value: 250,
      priceType: 'onetime' as const,
      description: 'Test description',
      isEnabled: true,
      createdAt: new Date()
    };

    render(
      <DiscountForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editingDiscount={editingDiscount}
      />
    );

    expect(screen.getByDisplayValue('250')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByText('Add manual discount')).toBeInTheDocument();
  });
});