import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { PizzaTypeComponent } from '../../components/PizzaTypeComponent';

describe('PizzaTypeComponent', () => {
  const mockPizzaType = {
    id: 'pizza-123',
    name: 'Margherita',
    description: 'Classic Italian pizza',
    price: 10.99,
    dough: {
      id: 'dough-456',
      name: 'Thin Crust',
      description: 'Traditional thin crust',
      price: 2.99
    },
    toppings: [
      {
        id: 'topping-789',
        name: 'Mozzarella',
        description: 'Fresh mozzarella cheese',
        quantity: 2,
        price: 1.99
      },
      {
        id: 'topping-101',
        name: 'Basil',
        description: 'Fresh basil leaves',
        quantity: 1,
        price: 0.99
      }
    ]
  };

  it('renders pizza type details correctly', () => {
    render(<PizzaTypeComponent pizzaType={mockPizzaType} />);

    // Test main pizza details
    expect(screen.getByText(/Margherita/)).toBeInTheDocument();
    expect(screen.getByText(/Classic Italian pizza/)).toBeInTheDocument();
    expect(screen.getByText(/Price: 10.99/)).toBeInTheDocument();

    // Test dough details
    expect(screen.getByText('Dough')).toBeInTheDocument();
    expect(screen.getByText(/Thin Crust/)).toBeInTheDocument();
    expect(screen.getByText(/Traditional thin crust/)).toBeInTheDocument();
    expect(screen.getByText(/Price: 2.99/)).toBeInTheDocument();

    // Test toppings
    expect(screen.getByText('Toppings:')).toBeInTheDocument();

    // Test first topping
    expect(screen.getByText(/Mozzarella/)).toBeInTheDocument();
    expect(screen.getByText(/Fresh mozzarella cheese/)).toBeInTheDocument();
    expect(screen.getByText(/Quantity: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Price: 1.99/)).toBeInTheDocument();

    // Test second topping
    expect(screen.getByText(/Basil/)).toBeInTheDocument();
    expect(screen.getByText(/Fresh basil leaves/)).toBeInTheDocument();
    expect(screen.getByText(/Quantity: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Price: 0.99/)).toBeInTheDocument();
  });


  it('renders correct number of toppings', () => {
    render(<PizzaTypeComponent pizzaType={mockPizzaType} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockPizzaType.toppings.length);
  });
});
