import { h, FunctionComponent } from 'preact';
import { ShowAndCopyIdComponent } from './ShowAndCopyIDComponent';
import { ACTION_CREATE_DOUGH, ACTION_CREATE_PREMADE_DOUGH, ACTION_DELETE_DOUGHS, ACTION_UPDATE_DOUGH_STOCK } from '../constants';
import { useContext, useState } from 'preact/hooks';
import { AppStateContext } from '../AppLogic';
import CreateInventoryDialog from './CreateInventoryDialog';

export const DoughListComponent : FunctionComponent = () => {
  
  const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)
    const isServerActionInProgress = appState.systemStore.value.serverActionInProgress == true;
    const [ isCreateDoughDialogOpen, setIsDoughDialogCreateOpen  ] = useState(false);
  
  const updateDoughStock = (id : string, amount: number) => {
    pushAction({type: ACTION_UPDATE_DOUGH_STOCK, 
      payload: { id , amount },
      finishFunction : () => (true)})
  }

  const { doughs, loading, error } = appState.doughsStore.value;

  const createPremadeDough = () => {
    pushAction({ type : ACTION_CREATE_PREMADE_DOUGH,
      finishFunction : () => (true)
     })
  }

  const deleteDough = ( id : string) => {
      pushAction( { type: ACTION_DELETE_DOUGHS,
          payload : { doughIds :  [id], doFetch : true },
          finishFunction : () => (true) })
    }
  

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <CreateInventoryDialog
      inventoryName='Dough'
      defaultAmount={5}
      action={ACTION_CREATE_DOUGH}
        isOpen={isCreateDoughDialogOpen} 
        onClose={() => setIsDoughDialogCreateOpen(false)} 
      /> 
      <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Doughs</h2>
            <div>
              <button disabled={isServerActionInProgress} 
                onClick={() => setIsDoughDialogCreateOpen(true)}>Create</button>
              <button disabled={isServerActionInProgress} 
                onClick={() => createPremadeDough()}>+</button>
            </div>
      </div> 
    <div className="spinner-container">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <ul>
        {doughs.map( (dough) => <li key={dough.id}>
          <ShowAndCopyIdComponent id={dough.id} type="Dough-id" content={dough.name}/>
          ({dough.description}) Stock: {dough.stock}
          <button disabled={isServerActionInProgress} onClick={ () => updateDoughStock(dough.id,5)}>Update Stock by 5</button>
          <button disabled={isServerActionInProgress} style=" margin:0; background-color :rgb(242, 246, 250);"  onClick={ () => deleteDough(dough.id) }>&#128465;</button>
          
          </li>)}
      </ul>
    </div>
    </div>
  );
};