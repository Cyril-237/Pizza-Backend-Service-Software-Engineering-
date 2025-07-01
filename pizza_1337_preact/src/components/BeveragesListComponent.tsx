import { h, FunctionComponent } from 'preact';
import { ACTION_CREATE_BEVERAGE, ACTION_CREATE_PREMADE_BEVERAGE, ACTION_DELETE_BEVERAGES, ACTION_UPDATE_BEVERAGE_STOCK } from '../constants';
import { ShowAndCopyIdComponent } from './ShowAndCopyIDComponent';
import { AppStateContext } from '../AppLogic';
import { useContext, useState } from 'preact/hooks';
import CreateInventoryDialog from './CreateInventoryDialog';


export const BeveragesListComponent : FunctionComponent = () => {
  
 const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)

     const isServerActionInProgress = appState.systemStore.value.serverActionInProgress == true;
     const [ isCreateBeverageDialogOpen, setIsBeverageDialogCreateOpen  ] = useState(false);
 

 const updateBeverageStock = (id : string, amount : number) : void => {
    pushAction({ type: ACTION_UPDATE_BEVERAGE_STOCK, 
      payload: { id, amount },
      finishFunction : () => (true) });
  }

    const createPremadeBeverage = () => {
      pushAction({ type : ACTION_CREATE_PREMADE_BEVERAGE,
        finishFunction : () => (true)
       })
    }
  
    const deleteBeverage = ( id : string) => {
        pushAction( { type: ACTION_DELETE_BEVERAGES,
            payload : { beverageIds :  [id], doFetch : true },
            finishFunction : () => (true) })
      }
  

  const { beverages, loading, error } = appState.beveragesStore.value;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <CreateInventoryDialog
      inventoryName='Beverage'
      defaultAmount={12}
      action={ACTION_CREATE_BEVERAGE}
      isOpen={isCreateBeverageDialogOpen} 
      onClose={() => setIsBeverageDialogCreateOpen(false)} 
      /> 
    <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>Beverages</h2>
          <div>
            <button disabled={isServerActionInProgress} 
              onClick={() => setIsBeverageDialogCreateOpen(true)}>Create</button>
            <button disabled={isServerActionInProgress} 
              onClick={() => createPremadeBeverage()}>+</button>
          </div>
    </div> 

    <div className="spinner-container">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <ul>
        {beverages.map( (beverage) => 
        <li key={beverage.id}>
          <ShowAndCopyIdComponent id={beverage.id} type="Beverage-Id" content ={beverage.name} />
          Stock-Amount : {beverage.stock}
          <button disabled={isServerActionInProgress} onClick={ () => updateBeverageStock(beverage.id,5)}>Update Stock by 5</button>
          <button disabled={isServerActionInProgress} style=" margin:0; background-color :rgb(242, 246, 250);"  onClick={ () => deleteBeverage(beverage.id) }>&#128465;</button>
        </li>)}
      </ul>
      </div>
      </div>
  );
};