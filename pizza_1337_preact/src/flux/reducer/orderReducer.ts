import { create } from "mutative";
import { DISPATCH_START_FETCH_ORDERS, DISPATCH_FETCH_ORDERS_RESULT, 
    DISPATCH_FETCH_ORDERS_ERROR, DISPATCH_START_FETCH_ORDER_DETAILS, 
    DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT, 
    DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT, 
    DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT, 
    DISPATCH_END_FETCH_ORDER_DETAILS, DISPATCH_FETCH_ORDER_DETAILS_ERROR } from "../../constants";
import { ActionResult, AppStateChange, startOrderDetails, AppStateContent } from "../../types";

export const orderReducerWrapper = (action : ActionResult, appState : AppStateContent) : AppStateChange  => {
    
    if (action.payload?.orderId && appState.pizzaOrdersStore.orders[action.payload.orderId] == null) {
        console.warn("Warning: orderId not found in orders in updateOrderDetails")
        return appState;
    }
   
    return create(appState, draft => {
        switch (action.type) {
            case DISPATCH_START_FETCH_ORDERS:
                draft.pizzaOrdersStore.loading = true;
                draft.pizzaOrdersStore.error = null;
                break;
            case DISPATCH_FETCH_ORDERS_RESULT:
                draft.pizzaOrdersStore = { orders: action.payload, loading: false, error: null };
                break;
            case DISPATCH_FETCH_ORDERS_ERROR:
                draft.pizzaOrdersStore.loading = false;
                draft.pizzaOrdersStore.error = action.payload;
                break;
            case DISPATCH_START_FETCH_ORDER_DETAILS:
                draft.pizzaOrdersStore.orders[action.payload.orderId].orderDetails = startOrderDetails;
                break;
            case DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT:
                draft.pizzaOrdersStore.orders[action.payload.orderId].price = action.payload.price;
                break;
            case DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT:
                draft.pizzaOrdersStore.orders[action.payload.orderId].orderDetails!.pizzaTypes = action.payload.pizzaTypes;
                break;
            case DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT:
                draft.pizzaOrdersStore.orders[action.payload.orderId].orderDetails!.beverages = action.payload.beverages;
                break;
            case DISPATCH_END_FETCH_ORDER_DETAILS:
                draft.pizzaOrdersStore.orders[action.payload.orderId].orderDetails!.loading = false;
                break;
            case DISPATCH_FETCH_ORDER_DETAILS_ERROR:
                draft.pizzaOrdersStore.orders[action.payload.orderId].orderDetails!.loading = false;
                draft.pizzaOrdersStore.orders[action.payload.orderId].orderDetails!.error = action.payload.error;
                break;
        }     
    })
}
    
 
export const orderReducerActions = [
    DISPATCH_START_FETCH_ORDERS,
    DISPATCH_FETCH_ORDERS_RESULT,
    DISPATCH_FETCH_ORDERS_ERROR,
    DISPATCH_START_FETCH_ORDER_DETAILS,
    DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT,
    DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT,
    DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT,
    DISPATCH_END_FETCH_ORDER_DETAILS,
    DISPATCH_FETCH_ORDER_DETAILS_ERROR
]



