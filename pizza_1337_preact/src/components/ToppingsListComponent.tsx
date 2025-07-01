import { h, FunctionComponent } from 'preact';
import { ShowAndCopyIdComponent } from './ShowAndCopyIDComponent';
import { ACTION_CREATE_PREMADE_TOPPING, ACTION_CREATE_TOPPING, ACTION_DELETE_TOPPINGS, ACTION_UPDATE_TOPPING_STOCK } from '../constants';
import { useContext, useState } from 'preact/hooks';
import { AppStateContext } from '../AppLogic';
import CreateInventoryDialog from './CreateInventoryDialog';


export const ToppingsListComponent : FunctionComponent = (  ) => {
  
  const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)
  const isServerActionInProgress = appState.systemStore.value.serverActionInProgress == true;
  const [ isCreateToppingDialogOpen, setIsToppingDialogCreateOpen  ] = useState(false);

  const updateToppingsStock = ( id : string, amount : number ) => {
    pushAction( { type : ACTION_UPDATE_TOPPING_STOCK, 
      payload : { id, amount },
      finishFunction : () => (true) })
  }

  const createPremadeTopping = () => {
    pushAction({ type : ACTION_CREATE_PREMADE_TOPPING,
      finishFunction : () => (true) })
  }
  const deleteTopping = ( id : string) => {
    pushAction( { type: ACTION_DELETE_TOPPINGS,
        payload : { toppingIds :  [id] , doFetch : true },
        finishFunction : () => (true) })
  }

  const { toppings, loading, error } = appState.toppingsStore.value;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <CreateInventoryDialog
        inventoryName='Topping'
        defaultAmount={5}
        action={ACTION_CREATE_TOPPING}
        isOpen={isCreateToppingDialogOpen} 
        onClose={() => setIsToppingDialogCreateOpen(false)} 
      /> 
      <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Toppings</h2>
            <div>
              <button disabled={isServerActionInProgress} 
                onClick={() => setIsToppingDialogCreateOpen(true)}>Create</button>
              <button disabled={isServerActionInProgress} 
                onClick={() => createPremadeTopping()}>+</button>
            </div>
      </div>      
    <div className="spinner-container">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <ul>
        {toppings.map( (topping) => <li key={topping.id}>
          <ShowAndCopyIdComponent id={topping.id} type="Topping-Id" content={topping.name}/>
          ({topping.description}) Stock: {topping.stock}
          <button disabled={isServerActionInProgress}  onClick={ () => updateToppingsStock(topping.id,5) }>Update Stock by 5</button>
          <button disabled={isServerActionInProgress} style=" margin:0; background-color :rgb(242, 246, 250);"  onClick={ () => deleteTopping(topping.id) }>&#128465;</button>
          </li>)}          
      </ul>
    </div>
    </div>
    
  );
};