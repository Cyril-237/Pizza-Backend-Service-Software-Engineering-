import { ACTION_SERVER_ERROR, DISPATCH_ADD_SERVER_ERROR, ACTION_SERVER_ERROR_HANDLED, DISPATCH_REMOVE_SERVER_ERROR, ACTION_SET_SERVER_ACTION_IN_PROGRESS, DISPATCH_SET_SERVER_ACTION_IN_PROGRESS, ACTION_FETCH_ALL_AWAIT, ACTION_DELETE_BEVERAGES, ACTION_DELETE_DOUGHS, ACTION_DELETE_ORDERS, ACTION_DELETE_PIZZA_TYPES, ACTION_DELETE_TOPPINGS, ACTION_FETCH_BEVERAGES, ACTION_FETCH_DOUGHS, ACTION_FETCH_ORDERS, ACTION_FETCH_PIZZA_TYPES, ACTION_FETCH_TOPPINGS, ACTION_FETCH_USERS, ACTION_DELETE_ALL } from "../../constants"
import { ActionRegister } from "../../types";
import { reducer } from "../reducer/Reducer";
import { ActionService } from "./ActionService";


export class SystemActions implements ActionRegister {
    private actionService!: ActionService;

    public registerActions = (a: ActionService) => {
        this.actionService = a;

        this.actionService.register(ACTION_FETCH_ALL_AWAIT, this.fetchAllAwait);
        this.actionService.register(ACTION_DELETE_ALL, async () => this.deleteAll());

        this.actionService.register(ACTION_SERVER_ERROR,
            async (payload: any) => reducer.dispatch({ type: DISPATCH_ADD_SERVER_ERROR, payload }, this.actionService.appState)
        )
        this.actionService.register(ACTION_SERVER_ERROR_HANDLED,
            async (payload: any) => reducer.dispatch({ type: DISPATCH_REMOVE_SERVER_ERROR, payload }, this.actionService.appState)
        )
        this.actionService.register(ACTION_SET_SERVER_ACTION_IN_PROGRESS,
            async (payload: any) => reducer.dispatch({ type: DISPATCH_SET_SERVER_ACTION_IN_PROGRESS, payload }, this.actionService.appState)
        )
    }

    private fetchAllAwait = async () => {
        await Promise.all([
            this.actionService.executeAction({ type: ACTION_FETCH_BEVERAGES }),
            this.actionService.executeAction({ type: ACTION_FETCH_DOUGHS }),
            this.actionService.executeAction({ type: ACTION_FETCH_TOPPINGS }),
            this.actionService.executeAction({ type: ACTION_FETCH_USERS }),
            this.actionService.executeAction({ type: ACTION_FETCH_ORDERS }),
            this.actionService.executeAction({ type: ACTION_FETCH_PIZZA_TYPES })
        ])
    }

    private deleteAll = async () => {

        const payload = { 
            orderIds : Object.keys(this.actionService.appState.pizzaOrdersStore.peek().orders),
            pizzaTypeIds : this.actionService.appState.pizzaTypesStore.peek().pizzaTypes.map( p => p.id ),
            beverageIds : this.actionService.appState.beveragesStore.peek().beverages.map( b => b.id ),
            toppingIds : this.actionService.appState.toppingsStore.peek().toppings.map( t => t.id),
            doughIds : this.actionService.appState.doughsStore.peek().doughs.map( d => d.id)
         } 

        await this.actionService.executeAction({ type: ACTION_DELETE_ORDERS, payload });
        await this.actionService.executeAction({ type: ACTION_DELETE_PIZZA_TYPES, payload });
        await Promise.all([
            this.actionService.executeAction({ type: ACTION_DELETE_BEVERAGES, payload }),
            this.actionService.executeAction({ type: ACTION_DELETE_TOPPINGS, payload }),
            this.actionService.executeAction({ type: ACTION_DELETE_DOUGHS, payload })
        ])
        await this.actionService.executeAction({ type: ACTION_FETCH_ALL_AWAIT });
    }
}