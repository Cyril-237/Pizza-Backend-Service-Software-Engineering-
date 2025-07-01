import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { AppStateContext } from '../AppLogic';

interface CreateInventoryDialogProperties {
  isOpen: boolean;
  inventoryName : string;
  action : string;
  defaultAmount : number;
  onClose: () => void;
}

const CreateInventoryDialog = (props: CreateInventoryDialogProperties) => {
  const { pushActionIntoQueue: pushAction } = useContext(AppStateContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    setName('');
    setDescription('');
    setPrice('');
  }, [props.isOpen]);

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [props.onClose]);


  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    props.onClose();

    pushAction({
      type: props.action,
      payload: {
        name,
        description,
        price: parseFloat(price),
        stock: props.defaultAmount
      },
      finishFunction: () => true
    });
  };

  if (!props.isOpen) return null;

  return (
    <div class="dialog-overlay">
      <div class="dialog-content card">
        <h2>Create New {props.inventoryName}</h2>
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label>
              {props.inventoryName} Name:
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
              Description:
              <input
                type="text"
                value={description}
                onChange={e => setDescription((e.target as HTMLInputElement).value)}
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

          <div class="dialog-actions">
            <button type="submit">Create {props.inventoryName}</button>
            <button type="button" onClick={props.onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInventoryDialog;
