import { create } from "mutative";
import {
    DISPATCH_START_FETCH_PIZZA_TYPES, DISPATCH_FETCH_PIZZA_TYPES_RESULT,
    DISPATCH_FETCH_PIZZA_TYPES_ERROR, DISPATCH_START_FETCH_USERS,
    DISPATCH_FETCH_USERS_RESULT, DISPATCH_FETCH_USERS_ERROR,
    DISPATCH_ADD_SERVER_ERROR, DISPATCH_REMOVE_SERVER_ERROR,
    DISPATCH_SET_SERVER_ACTION_IN_PROGRESS
} from "../../constants";
import {
    ReducerFunctionsMapType, ReducerFunction, ActionResult, AppStateChange,
    AppStateContent,
    AppState
} from "../../types";
import {
    beverageReducerWrapper, beverageReducerActions, doughReducerWrapper,
    doughReducerActions, toppingReducerWrapper, toppingReducerActions
} from "./inventoryReducer";
import { orderReducerWrapper, orderReducerActions } from "./orderReducer";


const pizzaTypeReducerActions = [
    DISPATCH_START_FETCH_PIZZA_TYPES,
    DISPATCH_FETCH_PIZZA_TYPES_RESULT,
    DISPATCH_FETCH_PIZZA_TYPES_ERROR
]

const pizzaTypeReducerWrapper = (action: ActionResult, appState: AppStateContent): AppStateChange => {

    return create(appState, draft => {
        switch (action.type) {
            case DISPATCH_START_FETCH_PIZZA_TYPES:
                draft.pizzaTypesStore.loading = true;
                draft.pizzaTypesStore.error = null;
                break;
            case DISPATCH_FETCH_PIZZA_TYPES_RESULT:
                draft.pizzaTypesStore = {
                    pizzaTypes: action.payload,
                    loading: false, error: null
                };
                break;
            case DISPATCH_FETCH_PIZZA_TYPES_ERROR:
                draft.pizzaTypesStore.loading = false;
                draft.pizzaTypesStore.error = action.payload;
                break;
        }
    })
}


const userReducerActions = [
    DISPATCH_START_FETCH_USERS,
    DISPATCH_FETCH_USERS_RESULT,
    DISPATCH_FETCH_USERS_ERROR
]

const userReducerWrapper = (action: ActionResult, appState: AppStateContent): AppStateChange => {

    return create(appState, draft => {
        switch (action.type) {
            case DISPATCH_START_FETCH_USERS:
                draft.usersStore.loading = true;
                draft.usersStore.error = null;
                break;
            case DISPATCH_FETCH_USERS_RESULT:
                draft.usersStore = { users: action.payload, loading: false, error: null };
                break;
            case DISPATCH_FETCH_USERS_ERROR:
                draft.usersStore.loading = false;
                draft.usersStore.error = action.payload;
                break;
        }
    })
}

const systemReducerActions = [
    DISPATCH_ADD_SERVER_ERROR,
    DISPATCH_REMOVE_SERVER_ERROR,
    DISPATCH_SET_SERVER_ACTION_IN_PROGRESS
]

const systemReducerWrapper = (action: ActionResult, appState: AppStateContent): AppStateChange => {

    const nextAppStateContent = create(appState, (draft) => {
        switch (action.type) {
            case DISPATCH_ADD_SERVER_ERROR:
                draft.systemStore.errors.push(action.payload);
                break;
            case DISPATCH_REMOVE_SERVER_ERROR:
                draft.systemStore.errors.splice(0);
                break;
            case DISPATCH_SET_SERVER_ACTION_IN_PROGRESS:
                draft.systemStore.serverActionInProgress = action.payload;
                break;
        }
    })
    return nextAppStateContent as AppStateChange;

}

class Reducer {

    private readonly reducerFunctionsMap: ReducerFunctionsMapType = {};

    constructor() {
        this.registerAllReducers();
    }

    private registerReducers = (type: string, reducerFunction: ReducerFunction) => {
        this.reducerFunctionsMap[type] = reducerFunction;
    }

    private registerAllReducers = () => {

        const reducerMappings = {
            order: {
                wrapper: orderReducerWrapper,
                actions: orderReducerActions
            },
            beverage: {
                wrapper: beverageReducerWrapper,
                actions: beverageReducerActions
            },
            dough: {
                wrapper: doughReducerWrapper,
                actions: doughReducerActions
            },
            topping: {
                wrapper: toppingReducerWrapper,
                actions: toppingReducerActions
            },
            pizzaType: {
                wrapper: pizzaTypeReducerWrapper,
                actions: pizzaTypeReducerActions
            },
            user: {
                wrapper: userReducerWrapper,
                actions: userReducerActions
            },
            error: {
                wrapper: systemReducerWrapper,
                actions: systemReducerActions
            }
        };

        Object.values(reducerMappings).forEach(({ wrapper, actions }) => {
            actions.forEach(action => this.registerReducers(action, wrapper));
        });

    }

    public dispatch (action: ActionResult, appState: AppState) {
            const reducer = this.reducerFunctionsMap[action.type];
            if (reducer) {
                const inputState: AppStateContent = {
                    pizzaOrdersStore: appState.pizzaOrdersStore.peek(),
                    pizzaTypesStore: appState.pizzaTypesStore.peek(),
                    beveragesStore: appState.beveragesStore.peek(),
                    doughsStore: appState.doughsStore.peek(),
                    toppingsStore: appState.toppingsStore.peek(),
                    usersStore: appState.usersStore.peek(),
                    systemStore: appState.systemStore.peek()
                }

                const newState = reducer(action, inputState);

                appState.pizzaOrdersStore.value = newState.pizzaOrdersStore;
                appState.pizzaTypesStore.value = newState.pizzaTypesStore;
                appState.beveragesStore.value = newState.beveragesStore;
                appState.doughsStore.value = newState.doughsStore;
                appState.toppingsStore.value = newState.toppingsStore;
                appState.usersStore.value = newState.usersStore;
                appState.systemStore.value = newState.systemStore;
            }
        }
}

export const reducer = new Reducer();


