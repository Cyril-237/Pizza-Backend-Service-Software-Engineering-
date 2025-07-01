import { test, expect, vi } from 'vitest'
import { AppStateContent, BeveragesInfoWithQuantity,  OrderDetails, OrderMap, 
    startOrderDetails } from '../../types';
import { AddressSchema, BeverageSchema, OrderSchema, OrderStatus, PizzaTypeSchema } from '../../api';
import { DISPATCH_START_FETCH_ORDERS, DISPATCH_FETCH_ORDERS_RESULT, 
    DISPATCH_FETCH_ORDERS_ERROR, 
    DISPATCH_START_FETCH_ORDER_DETAILS, DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT, 
    DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT, 
    DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT, 
    DISPATCH_FETCH_ORDER_DETAILS_ERROR, DISPATCH_END_FETCH_ORDER_DETAILS, 
    DISPATCH_START_FETCH_BEVERAGES, DISPATCH_FETCH_BEVERAGES_RESULT, 
    DISPATCH_FETCH_BEVERAGES_ERROR } from '../../constants';
import { orderReducerWrapper } from '../../flux/reducer/orderReducer';
import { createInitialAppStateContent } from '../../flux/store/store';
import { beverageReducerWrapper } from '../../flux/reducer/inventoryReducer';

const address1_uuid = crypto.randomUUID() 
const user1_uuid = crypto.randomUUID()
const order1_uuid = crypto.randomUUID()
const order1_datetime = '2025-01-01T11:30:00.123'
const pizzaType1_uuid = crypto.randomUUID()
const beverage1_uuid = crypto.randomUUID()

const address1 : AddressSchema = {
    street: 'TestStreet',
    post_code: '12345',
    house_number: 42,
    country: 'Germany',
    town: 'Darmstadt',
    first_name: 'John',
    last_name: 'Doe',
    id: address1_uuid 
}
const order1 : OrderSchema  = {
    address : address1,
    user_id: user1_uuid, 
    order_status: OrderStatus.TRANSMITTED,
    id: order1_uuid,
    order_datetime: order1_datetime
}

const pizzaType1 : PizzaTypeSchema = {
    name: 'Funghi',
    price: 14.2,
    description: 'Pizza mit Pilzen',
    id: pizzaType1_uuid
}

const beverage1 : BeverageSchema = {
    name: 'Green Tea',
    price: 2.5,
    description: 'Grüner Tee mit Grapefruit Aroma',
    id: beverage1_uuid,
    stock : 1,
}
// this removes the "stock" key from the beverage1 -> stock should not be present
// in beverage1_Info ...
const { stock, ...beverage_without_stock } = beverage1;
const beverage1_Info : BeveragesInfoWithQuantity = {
    ...beverage_without_stock,
    quantity : 1
}

const orderDetails1: OrderDetails = {
    pizzaTypes: [pizzaType1],
    beverages: [beverage1_Info, beverage1_Info],
    loading: true,
    error: null
}

test('orderReducer actions start', () => {
    // arrange
    const action = { type: DISPATCH_START_FETCH_ORDERS };
    const state : AppStateContent = createInitialAppStateContent() 

    // act 
    const { pizzaOrdersStore: newState } = orderReducerWrapper(action, state);

    // assert
    expect(newState.loading).toBeTruthy();
    expect(newState.orders).toStrictEqual({});
    expect(newState.error).toBeNull()
})

test('orderReducer actions order results', () => {
    // arrange
    const payload : OrderMap = { [order1_uuid]: { ...order1, orderDetails : null, price: null } }
    const action = { type: DISPATCH_FETCH_ORDERS_RESULT, payload };
    const state : AppStateContent = createInitialAppStateContent() 

    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);

    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, orderDetails : null, price: null }});
    expect(newState.error).toBeNull()
})

test('orderReducer actions order error', () => {
    // arrange
    const payload : string = "Some error while processing or fetching orders"
    const action = { type: DISPATCH_FETCH_ORDERS_ERROR, payload };
    const state : AppStateContent = createInitialAppStateContent() 

    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);

    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ });
    expect(newState.error).toEqual("Some error while processing or fetching orders")
})

test('orderReducer start fetch order details', () => {
     // arrange
     const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : null, price: null } }
     const action = { type: DISPATCH_START_FETCH_ORDER_DETAILS, payload: { orderId: order1_uuid } }
     const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }

 
     // act 
     const { pizzaOrdersStore : newState }  = orderReducerWrapper(action,state);
 
     // assert
     expect(newState.loading).toBeFalsy();
     expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, orderDetails : startOrderDetails, price: null }});
     expect(newState.error).toBeNull()
     expect(newState.orders[order1_uuid].orderDetails?.loading).toBeTruthy();
})

test('orderReducer start fetch order details without matching order', () => {
    // arrange
    const warnSpy = vi.spyOn(console, 'warn');
    const orders : OrderMap = { }
    const action = { type: DISPATCH_START_FETCH_ORDER_DETAILS, payload: { orderId: order1_uuid } }
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }


    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);

    // assert
    expect(warnSpy).toHaveBeenCalledWith('Warning: orderId not found in orders in updateOrderDetails')
    warnSpy.mockRestore()

    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ });
    expect(newState.error).toBeNull()
})

test('orderReducer order details price result', () => {
    // arrange
    const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : startOrderDetails, price: null } }
    const action = { type: DISPATCH_FETCH_ORDER_DETAILS_PRICE_RESULT, payload: { orderId: order1_uuid, price: 42.0 } }
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }

    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);

    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, orderDetails : startOrderDetails, price: 42.0 }});
    expect(newState.error).toBeNull()
    expect(newState.orders[order1_uuid].orderDetails?.loading).toBeTruthy();
})

test('orderReducer order details pizza type result', () => {
    // arrange
    const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : startOrderDetails, price: 42.0 } }
    const action = { type: DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT, 
        payload: { orderId: order1_uuid, pizzaTypes: [ pizzaType1 ] } }
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }
    

    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);
    
    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, 
        orderDetails : { ...startOrderDetails, pizzaTypes : [pizzaType1]},
        price: 42.0 }});
    expect(newState.error).toBeNull()
    expect(newState.orders[order1_uuid].orderDetails?.loading).toBeTruthy();
})

test('orderReducer order details pizza type result without matching order', () => {
    // arrange
    const warnSpy = vi.spyOn(console, 'warn');
    const orders : OrderMap = { }
    const action = { type: DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT, 
        payload: { orderId: order1_uuid, pizzaTypes: [ pizzaType1 ] } }
    const state : AppStateContent = createInitialAppStateContent() 


    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);
    
    // assert
    expect(warnSpy).toHaveBeenCalledWith('Warning: orderId not found in orders in updateOrderDetails')
    warnSpy.mockRestore()
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ });
    expect(newState.error).toBeNull()
})


test('orderReducer order details pizza type result', () => {
    // arrange
    const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : startOrderDetails, price: 42.0 } }
    const action = { type: DISPATCH_FETCH_ORDER_DETAILS_PIZZA_TYPES_RESULT, 
        payload: { orderId: order1_uuid, pizzaTypes: [ pizzaType1 ] } }
    
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } } 

    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);
    
    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, 
        orderDetails : { ...startOrderDetails, pizzaTypes : [pizzaType1]},
        price: 42.0 }});
    expect(newState.error).toBeNull()
    expect(newState.orders[order1_uuid].orderDetails?.loading).toBeTruthy();
})

test('orderReducer order details beverages result', () => {
    // arrange
    const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : startOrderDetails, price: 42.0 } }
    const action = { type: DISPATCH_FETCH_ORDER_DETAILS_BEVERAGES_RESULT, 
        payload: { orderId: order1_uuid, beverages: [ beverage1  ] } }
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }
    
    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);
    
    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, 
        orderDetails : { ...startOrderDetails, beverages : [beverage1]},
        price: 42.0 }});
    expect(newState.error).toBeNull()
    expect(newState.orders[order1_uuid].orderDetails?.loading).toBeTruthy();
})

test('orderReducer order details error', () => {
    // arrange
    const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : startOrderDetails, price: 42.0 } }
    const action = { type: DISPATCH_FETCH_ORDER_DETAILS_ERROR,
        payload: { orderId: order1_uuid, error: "Something went wrong with the Order Details" } }
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }
    
    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);
        
    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, 
        orderDetails : { ...startOrderDetails, loading: false, error: "Something went wrong with the Order Details"},
        price: 42.0 }});
})

test('orderReducer order details end fetch', () => {
    // arrange
    const orders : OrderMap = { [order1_uuid]: { ...order1, orderDetails : orderDetails1, price: 42.0 } }
    const action = { type: DISPATCH_END_FETCH_ORDER_DETAILS,
        payload: { orderId: order1_uuid, payload: { orderId: order1_uuid} } }
    const state : AppStateContent = { ...createInitialAppStateContent(),
        pizzaOrdersStore : { orders, loading: false, error : null } }
    
    // act 
    const { pizzaOrdersStore : newState } = orderReducerWrapper(action,state);
        
    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.orders).toEqual({ [order1_uuid] : { ...order1, 
        orderDetails : { ...orderDetails1, loading: false},
        price: 42.0 }});
})

test('orderReducer with some unknown action', () => {
    // arrange
    const state = createInitialAppStateContent();

    // act
    const newState = orderReducerWrapper({ type : 'UNKNOWN ACTION', payload: { id: 42 }}, state)

    // assert
    expect(newState).toEqual(state);
})

test('beverageReducer actions start', () => {
    // arrange
    const action = { type: DISPATCH_START_FETCH_BEVERAGES };
    const state : AppStateContent = createInitialAppStateContent() 

    // act 
    const { beveragesStore : newState } = beverageReducerWrapper(action,state);

    // assert
    expect(newState.loading).toBeTruthy();
    expect(newState.beverages).toStrictEqual([]);
    expect(newState.error).toBeNull()
})

test('beverageReducer actions beverage results', () => {
    // arrange
    const payload : BeverageSchema[] = [ beverage1 ]
    const action = { type: DISPATCH_FETCH_BEVERAGES_RESULT, payload };
    const state : AppStateContent = createInitialAppStateContent() 

    // act 
    const { beveragesStore : newState } = beverageReducerWrapper(action,state);

    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.beverages).toEqual([beverage1]);
    expect(newState.error).toBeNull()
})

test('beverageReducer actions order error', () => {
    // arrange
    const payload : string = "Some error while processing or fetching beverages"
    const action = { type: DISPATCH_FETCH_BEVERAGES_ERROR, payload };
    const state : AppStateContent = createInitialAppStateContent() 

    // act 
    const { beveragesStore : newState } = beverageReducerWrapper(action,state);

    // assert
    expect(newState.loading).toBeFalsy();
    expect(newState.beverages).toEqual([]);
    expect(newState.error).toEqual("Some error while processing or fetching beverages")
})

