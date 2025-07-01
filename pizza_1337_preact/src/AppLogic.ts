import { RestAdapterPizzaBackend } from "./ports_adapters/adapters/RestAdapterPizzaBackend";
import { PizzaBackendService } from "./ports_adapters/services/PizzaBackendService";
import { createAppState } from "./flux/store/store";
import { Action, AppStateContextValue } from "./types";
import { createContext } from "preact";
import { InventoryActions } from "./flux/actions/InventoryActions";
import { OrderActions } from "./flux/actions/OrderActions";
import { PizzaTypeActions } from "./flux/actions/PizzaTypeActions";
import { UsersActions } from "./flux/actions/UsersActions";
import { SystemActions } from "./flux/actions/SystemActions";
import { ActionService } from "./flux/actions/ActionService";

const appState = createAppState();
const pizzaBackendService = new PizzaBackendService(new RestAdapterPizzaBackend());
const actionService = new ActionService(pizzaBackendService, appState);

// exported for tests -> we need to be able
// to Re-Register Actions

export const allActionRegistryClasses = [ 
  new SystemActions(),
  new OrderActions(),
  new InventoryActions(),
  new UsersActions(),
  new PizzaTypeActions()
]
actionService.registerActions( allActionRegistryClasses );

const pushActionIntoQueue = (action : Action) => {
  actionService.pushActionIntoQueue(action);
}

export const AppStateContext = createContext<AppStateContextValue>( {
  appState, pushActionIntoQueue
})

