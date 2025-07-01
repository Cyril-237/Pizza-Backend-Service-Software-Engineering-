import { create } from "mutative";
import { DISPATCH_START_FETCH_DOUGHS, DISPATCH_FETCH_DOUGHS_RESULT, 
    DISPATCH_FETCH_DOUGHS_ERROR, DISPATCH_FETCH_TOPPINGS_ERROR, 
    DISPATCH_FETCH_TOPPINGS_RESULT, DISPATCH_START_FETCH_TOPPINGS, 
    DISPATCH_FETCH_BEVERAGES_ERROR, DISPATCH_FETCH_BEVERAGES_RESULT, 
    DISPATCH_START_FETCH_BEVERAGES } from "../../constants";
import { ActionResult, AppStateChange, AppStateContent } from "../../types";

export const beverageReducerWrapper = (action : ActionResult, appState : AppStateContent) : AppStateChange  => {
    
    return create(appState, draft => {
        switch (action.type) {
            case DISPATCH_START_FETCH_BEVERAGES:
                draft.beveragesStore.loading = true;
                draft.beveragesStore.error = null;
                break;
            case DISPATCH_FETCH_BEVERAGES_RESULT:
                draft.beveragesStore = { beverages: action.payload, loading: false, error: null };
                break;
            case DISPATCH_FETCH_BEVERAGES_ERROR:
                draft.beveragesStore.loading = false;
                draft.beveragesStore.error = action.payload;
                break;
        }
    })    
}

export const beverageReducerActions = [
    DISPATCH_START_FETCH_BEVERAGES,
    DISPATCH_FETCH_BEVERAGES_RESULT,
    DISPATCH_FETCH_BEVERAGES_ERROR
]

export const doughReducerWrapper = (action : ActionResult, appState : AppStateContent) : AppStateChange  => { 
    return create( appState, draft => {
        switch (action.type) {
            case DISPATCH_START_FETCH_DOUGHS:
                draft.doughsStore.loading = true;
                draft.doughsStore.error = null;
                break;
            case DISPATCH_FETCH_DOUGHS_RESULT:
                draft.doughsStore = {doughs: action.payload, loading: false, error: null };
                break;
            case DISPATCH_FETCH_DOUGHS_ERROR:
                draft.doughsStore.loading = false;
                draft.doughsStore.error = action.payload;
                break;
        }
    })
}

export const doughReducerActions = [
    DISPATCH_START_FETCH_DOUGHS,
    DISPATCH_FETCH_DOUGHS_RESULT,
    DISPATCH_FETCH_DOUGHS_ERROR
]


export const toppingReducerWrapper = (action : ActionResult, appState : AppStateContent) : AppStateChange  => {
    
    return create(appState, draft => {
        switch (action.type) {
            case DISPATCH_START_FETCH_TOPPINGS:
                draft.toppingsStore.loading = true;
                draft.toppingsStore.error = null;
                break;
            case DISPATCH_FETCH_TOPPINGS_RESULT:
                draft.toppingsStore =  {  toppings: action.payload, loading: false, error: null };
                break;
            case DISPATCH_FETCH_TOPPINGS_ERROR:
                draft.toppingsStore.loading = false;
                draft.toppingsStore.error = action.payload;
                break;
        } 
    })
    
}

export const toppingReducerActions = [
    DISPATCH_START_FETCH_TOPPINGS,
    DISPATCH_FETCH_TOPPINGS_RESULT,
    DISPATCH_FETCH_TOPPINGS_ERROR
]

