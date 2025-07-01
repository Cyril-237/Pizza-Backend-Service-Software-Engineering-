import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { PizzaTypeSchema, BeverageSchema } from '../api';
import { IdAndQuantity } from '../types';
import { ACTION_CREATE_ORDER } from '../constants';
import { AppStateContext } from '../AppLogic';

interface SelectedItemSchema {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderProperties {
  isOpen: boolean;
  onClose: () => void;
}

const defaultAddress = {
  name: 'Mickey Mouse',
  street: 'Disney Boulevard',
  houseNumber: '42',
  town: 'Duckburg'
}

const CreateOrderDialog = (props: CreateOrderProperties) => {
  // User selection

  const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Address fields with fun default values
  const [address, setAddress] = useState(defaultAddress);

  // Selected items with quantities
  const [selectedPizzas, setSelectedPizzas] = useState<SelectedItemSchema[]>([]);
  const [selectedBeverages, setSelectedBeverages] = useState<SelectedItemSchema[]>([]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect( () => {
    setSelectedUserId('')
    setSelectedBeverages([])
    setSelectedPizzas([]);
    setAddress(defaultAddress)
  }, [props.isOpen])

  const handleSubmit = async (e: Event) => {

    e.preventDefault();
    props.onClose();

    const pizzasWithQuantities: IdAndQuantity[] = selectedPizzas.map(pizza => ({
      id: pizza.id,
      quantity: pizza.quantity
    }));

    const beveragesWithQuantities: IdAndQuantity[] = selectedBeverages.map(beverage => ({
      id: beverage.id,
      quantity: beverage.quantity
    }));

    pushAction({ type : ACTION_CREATE_ORDER , payload : {
      userId: selectedUserId, 
      address,
      pizzasWithQuantities,
      beveragesWithQuantities
    }, finishFunction : () => (true)})
  };

  const handlePizzaToggle = (pizza: PizzaTypeSchema) => {
    setSelectedPizzas(current => {
      const exists = current.find(p => p.id === pizza.id);
      if (exists) {
        return current.filter(p => p.id !== pizza.id);
      }
      return [...current, { ...pizza, quantity: 1 }];
    });
  };

  const handleBeverageToggle = (beverage: BeverageSchema) => {
    setSelectedBeverages(current => {
      const exists = current.find(b => b.id === beverage.id);
      if (exists) {
        return current.filter(b => b.id !== beverage.id);
      }
      return [...current, { ...beverage, quantity: 1 }];
    });
  };

  const updateItemQuantity = (
    itemId: string,
    quantity: string,
    setter: typeof setSelectedPizzas
  ) => {
    setter(current =>
      current.map(item =>
        item.id === itemId
          ? { ...item, quantity: parseInt(quantity) || 1 }
          : item
      )
    );
  };

  if (!props.isOpen) return null;

  return (
    <div class="dialog-overlay">
      <div class="dialog-content card">
        <h2>Create New Order</h2>
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label>
              Customer:
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId((e.target as HTMLSelectElement).value)}
                required
              >
                <option value="">Select a customer</option>
                {appState.usersStore.value.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div class="form-group">
            <h3>Delivery Address</h3>
            <label>
              Name:
              <input
                type="text"
                value={address.name}
                onChange={e => setAddress({...address, name: (e.target as HTMLInputElement).value})}
                required
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                value={address.street}
                onChange={e => setAddress({...address, street: (e.target as HTMLInputElement).value})}
                required
              />
            </label>
            <label>
              House Number:
              <input
                type="text"
                value={address.houseNumber}
                onChange={e => setAddress({...address, houseNumber: (e.target as HTMLInputElement).value})}
                required
              />
            </label>
            <label>
              Town:
              <input
                type="text"
                value={address.town}
                onChange={e => setAddress({...address, town: (e.target as HTMLInputElement).value})}
                required
              />
            </label>
          </div>

          <div class="form-group">
            <h3>Pizzas</h3>
            <div class="items-list">
              {appState.pizzaTypesStore.value.pizzaTypes.map(pizza => {
                const isSelected = selectedPizzas.find(p => p.id === pizza.id);
                return (
                  <div key={pizza.id} class="item">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handlePizzaToggle(pizza)}
                      />
                      {pizza.name} ({pizza.price}€)
                    </label>
                    {isSelected && (
                      <input
                        type="number"
                        min="1"
                        value={isSelected.quantity}
                        onChange={e => updateItemQuantity(pizza.id, (e.target as HTMLInputElement).value, setSelectedPizzas)}
                        class="quantity-input"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div class="form-group">
            <h3>Beverages</h3>
            <div class="items-list">
              {appState.beveragesStore.value.beverages.map(beverage => {
                const isSelected = selectedBeverages.find(b => b.id === beverage.id);
                return (
                  <div key={beverage.id} class="item">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleBeverageToggle(beverage)}
                      />
                      {beverage.name} ({beverage.price}€)
                    </label>
                    {isSelected && (
                      <input
                        type="number"
                        min="1"
                        value={isSelected.quantity}
                        onChange={e => updateItemQuantity(beverage.id, (e.target as HTMLInputElement).value, setSelectedBeverages)}
                        class="quantity-input"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div class="dialog-actions">
            <button type="submit">Create Order</button>
            <button type="button" onClick={props.onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderDialog;
