import { ApiError } from "../../api";
import { ActionService, createErrorMessage } from "./ActionService";
import {
    ACTION_CREATE_ORDER, ACTION_DELETE_ORDERS, ACTION_DELETE_ORDERS_AND_FETCH, DISPATCH_END_FETCH_ORDER_DETAILS,
    ACTION_FETCH_ALL_AWAIT, ACTION_FETCH_BEVERAGES, ACTION_FETCH_ORDER_CREATE_DATA, ACTION_FETCH_ORDER_DETAILS,
    DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT, DISPATCH_FETCH_ORDER_DETAILS_ERROR,
    DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT, DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT,
    ACTION_FETCH_ORDERS, DISPATCH_FETCH_ORDERS_ERROR, DISPATCH_FETCH_ORDERS_RESULT,
    ACTION_FETCH_PIZZA_TYPES,
    ACTION_FETCH_USERS,
    ACTION_SERVER_ERROR,
    DISPATCH_START_FETCH_ORDER_DETAILS, DISPATCH_START_FETCH_ORDERS
} from "../../constants";
import { ActionRegister, OrderMap } from "../../types";
import { reducer } from "../reducer/Reducer";

export class OrderActions implements ActionRegister {
    private actionService!: ActionService;

    public registerActions = (a: ActionService) => {

        this.actionService = a;

        this.actionService.register(ACTION_FETCH_ORDERS,
            async () => this.fetchOrders());
        this.actionService.register(ACTION_FETCH_ORDER_DETAILS,
            async (payload: any) => this.fetchOrderDetails(payload));
        this.actionService.register(ACTION_DELETE_ORDERS,
            async (payload: any) => this.deleteOrders(payload))
        // is equivalent to return deleteOrders( ... )
        // so it returns a promise which is resolved, when deleteOrders is resolved
        this.actionService.register(ACTION_DELETE_ORDERS_AND_FETCH,
            async (payload: any) => {
                await this.deleteOrders(payload);
                await this.actionService.executeAction({ type: ACTION_FETCH_ALL_AWAIT })
            })
            
        this.actionService.register(ACTION_FETCH_ORDER_CREATE_DATA,
            async () => {
                await Promise.all([
                    this.actionService.executeAction({ type: ACTION_FETCH_USERS }),
                    this.actionService.executeAction({ type: ACTION_FETCH_PIZZA_TYPES }),
                    this.actionService.executeAction({ type: ACTION_FETCH_BEVERAGES }),
                ])
            }
        )
        this.actionService.register(ACTION_CREATE_ORDER,
            async (payload: any) => {
                await this.createOrder(payload);
                await this.actionService.executeAction({ type: ACTION_FETCH_ALL_AWAIT });
            })
    }

    private fetchOrders = async () => {

        reducer.dispatch({ type: DISPATCH_START_FETCH_ORDERS }, this.actionService.appState);

        try {
            const ordersArray = await this.actionService.service.getOrders();
            const ordersMap: OrderMap = {}
            ordersArray.forEach(order => ordersMap[order.id] = { ...order, orderDetails: null, price: null })

            reducer.dispatch({ type: DISPATCH_FETCH_ORDERS_RESULT, payload: ordersMap }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_ORDERS_ERROR,
                payload: createErrorMessage(error as (ApiError | string))
            }, this.actionService.appState)
        }
    }

    private fetchAndSetOrderPrice = async (orderId: string) => {
        return this.actionService.service.getOrderPrice(orderId)
            .then(orderPriceSchema =>
                reducer.dispatch({
                    type: DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT,
                    payload: { orderId, price: orderPriceSchema.price }
                }, this.actionService.appState));
    }
    private fetchAndSetPizzasForOrder = async (orderId: string) => {
        return this.actionService.service.getListOfPizzaTypesForOrder(orderId)
            .then(pizzaTypes =>
                reducer.dispatch({
                    type: DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT,
                    payload: { orderId, pizzaTypes }
                }, this.actionService.appState)
            );
    }
    private fetchAndSetBeveragesForOrder = async (orderId: string) => {
        return this.actionService.service.getListOfBeveragesForOrder(orderId)
            .then(async beveragesInfo => {
                const beverages = await Promise.all(beveragesInfo.map(async info => {
                    let beveragesInfo = await this.actionService.service.getBeveragesCache(info.beverage_id)
                    return {
                        ...beveragesInfo,
                        quantity: info.quantity
                    }
                }
                ))
                reducer.dispatch({
                    type: DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT,
                    payload: { orderId, beverages }
                }, this.actionService.appState)
            });
    }


    private fetchOrderDetails = async (payload: any) => {

        const orderId = payload.orderId;

        reducer.dispatch({ type: DISPATCH_START_FETCH_ORDER_DETAILS, payload: { orderId } }, this.actionService.appState)

        try {

            await Promise.all([
                this.fetchAndSetOrderPrice(orderId),
                this.fetchAndSetPizzasForOrder(orderId),
                this.fetchAndSetBeveragesForOrder(orderId)])

                reducer.dispatch({
                type: DISPATCH_END_FETCH_ORDER_DETAILS,
                payload: { orderId }
            }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_ORDER_DETAILS_ERROR,
                payload: { orderId, error: createErrorMessage(error as (ApiError | string)) }
            }, this.actionService.appState)
        }
    }

    private deleteOrders = async (payload: any) => {
        const orderIds: string[] = payload.orderIds;
        try {
            await this.actionService.service.deleteOrders(orderIds);
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error });
        }
    }

    private createOrder = async (payload: any) => {
        const { userId, address, pizzasWithQuantities,
            beveragesWithQuantities } = payload;
        try {
            await this.actionService.service.createOrder(userId, address, pizzasWithQuantities, beveragesWithQuantities);
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }

    }
}
