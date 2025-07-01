// src/store/store.ts
import { signal } from "@preact/signals";
import { AppState, AppStateContent} from "../../types";

export const createInitialAppStateContent = () : AppStateContent => {
    return { pizzaOrdersStore : { orders : {}, loading: false, error : null },
             pizzaTypesStore: { pizzaTypes : [], loading: false, error : null },
             beveragesStore: { beverages : [], loading: false, error : null },
             toppingsStore: { toppings : [], loading: false, error : null },
             doughsStore: { doughs : [], loading: false, error : null },
             usersStore: { users : [], loading: false, error : null },
             systemStore: { errors : [], serverActionInProgress : false }}
}

export const createAppState : () =>  AppState  = ()  =>  {
    const initialAppStateContent = createInitialAppStateContent();
    return { pizzaOrdersStore : signal(initialAppStateContent.pizzaOrdersStore),
            toppingsStore : signal(initialAppStateContent.toppingsStore),
            pizzaTypesStore : signal(initialAppStateContent.pizzaTypesStore),
            beveragesStore : signal(initialAppStateContent.beveragesStore),
            usersStore : signal(initialAppStateContent.usersStore),
            doughsStore : signal(initialAppStateContent.doughsStore),
            systemStore : signal(initialAppStateContent.systemStore)
    }
}


