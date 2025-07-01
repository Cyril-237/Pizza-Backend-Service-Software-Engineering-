import { h, FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { PizzaTypeComponent } from './PizzaTypeComponent';
import CreatePizzaTypeDialog from './CreatePizzaTypeDialog';
import { ACTION_DELETE_PIZZA_TYPES_AND_FETCH, 
  ACTION_FETCH_PIZZA_TYPE_CREATE_DATA } from '../constants';
import { AppStateContext } from '../AppLogic';


export const PizzaTypesListComponent : FunctionComponent =  () => {
 
  const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)
  
  const [ isCreatePizzaTypeDialogOpen, setIsPizzaDialogCreateOpen  ] = useState(false);

  const isServerActionInProgress = appState.systemStore.value.serverActionInProgress == true;

  const { pizzaTypes, loading, error } = appState.pizzaTypesStore.value;

  const openPizzaTypeCreateDialog = () => {
    pushAction( { type : ACTION_FETCH_PIZZA_TYPE_CREATE_DATA ,
      finishFunction : () => setIsPizzaDialogCreateOpen(true)
    })
  }

  const deleteAllPizzaTypes = () => {
    if (isServerActionInProgress) {
      console.log("Delete PizzaTypes in Progress - ignoring")
      return;
    }
    const pizzaTypeIds = pizzaTypes.map(p => p.id);
    pushAction( { type : ACTION_DELETE_PIZZA_TYPES_AND_FETCH, 
      payload : { pizzaTypeIds },
      finishFunction : () => (true) })
  }
  
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <CreatePizzaTypeDialog
        isOpen={isCreatePizzaTypeDialogOpen} 
        onClose={() => setIsPizzaDialogCreateOpen(false)} 
      /> 
      <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Pizza-Types</h2>
            <div>
            <button disabled={isServerActionInProgress} 
              onClick={() => openPizzaTypeCreateDialog()}>Create</button>
            <a style=" cursor: pointer; margin-left: 10px" onClick={() => deleteAllPizzaTypes()}>&#128465;</a>
            </div>
      </div>      
      <div className="spinner-container">
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <div className="single-grid-container">
          {pizzaTypes.map( (pizzaType) => 
            <PizzaTypeComponent pizzaType={pizzaType} />)}
        </div>
      </div>
    </div>
  );
};