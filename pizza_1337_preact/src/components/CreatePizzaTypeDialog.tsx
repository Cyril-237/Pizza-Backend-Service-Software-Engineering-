import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ToppingSchema } from '../api';
import { IdAndQuantity } from '../types';
import { ACTION_CREATE_PIZZA_TYPE } from '../constants';
import { AppStateContext } from '../AppLogic';


interface SelectedToppingSchema extends ToppingSchema {
    quantity: number;
}

interface CreatePizzaTypeProperties {
  isOpen :boolean,
  onClose: () => void,
}
const CreatePizzaTypeDialog = ( props: CreatePizzaTypeProperties) => {

  const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedDough, setSelectedDough] = useState<string>(''); // dough-id 
  const [selectedToppings, setSelectedToppings] = useState<SelectedToppingSchema[]>( [] );

  useEffect( () => {
    setName('');
    setPrice('');
    setSelectedDough('')
    setSelectedToppings([])
  }, [props.isOpen])

  // Add useEffect to handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);


  const handleSubmit = async (e : Event) =>  {
    e.preventDefault();

    props.onClose();

    const toppingsWithQuantities : IdAndQuantity[] = selectedToppings.map(topping => ({
      id: topping.id,
      quantity: topping.quantity || 1
    }));

    pushAction({ type : ACTION_CREATE_PIZZA_TYPE, payload : {
      name,
      price: parseFloat(price),
      doughId: selectedDough!,
      toppings: toppingsWithQuantities
    }, finishFunction : () => (true)})
  };


  const handleToppingToggle = (topping : ToppingSchema) => {
    setSelectedToppings(current => {
      const exists = current.find(t => t.id === topping.id);
      if (exists) {
        return current.filter(t => t.id !== topping.id);
      }
      return [...current, { ...topping, quantity: 1 }];
    });
  };

  const updateToppingQuantity = (toppingId : string, quantity : string) => {
    setSelectedToppings(current =>
      current.map(t => 
        t.id === toppingId 
          ? { ...t, quantity: parseInt(quantity) || 1 }
          : t
      )
    );
  };

  if (!props.isOpen) return null;

  return (
    <div class="dialog-overlay">
      <div class="dialog-content card">
        <h2>Create New Pizza Type</h2>
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label>
              Pizza Name:
              <input
                type="text"
                value={name}
                onChange={e => setName((e.target as HTMLInputElement).value)}
                required
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              Price:
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice((e.target as HTMLInputElement).value)}
                required
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              Dough:
              <select 
                value={selectedDough}
                onChange={e => setSelectedDough((e.target as HTMLInputElement).value)}
                required
              >
                <option value="">Select a dough</option>
                {appState.doughsStore.value.doughs.map(dough => (
                  <option key={dough.id} value={dough.id}>
                    {dough.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div class="form-group">
            <label>Toppings:</label>
            <div class="toppings-list">
              {appState.toppingsStore.value.toppings.map(topping => {
                const isSelected = selectedToppings.find(t => t.id === topping.id);
                return (
                  <div key={topping.id} class="topping-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleToppingToggle(topping)}
                      />
                      {topping.name}
                    </label>
                    {isSelected && (
                      <input
                        type="number"
                        min="1"
                        value={isSelected.quantity}
                        onChange={e => updateToppingQuantity(topping.id, (e.target as HTMLInputElement).value)}
                        class="quantity-input"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div class="dialog-actions">
            <button type="submit">Create Pizza Type</button>
            <button type="button" onClick={props.onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePizzaTypeDialog;
