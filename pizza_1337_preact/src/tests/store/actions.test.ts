import { test, vi, expect } from 'vitest'
import { PizzaBackendService } from '../../ports_adapters/services/PizzaBackendService'
import { OrderSchema, JoinedPizzaPizzaTypeSchema, OrderBeverageQuantityCreateSchema, 
    OrderPriceSchema, BeverageSchema, AddressSchema, OrderStatus, 
    PizzaTypeSchema, PizzaTypeToppingQuantityCreateSchema, 
    ToppingSchema, DoughSchema } from '../../api'
import { PortPizzaBackend } from '../../ports_adapters/ports/PortPizzaBackend'
import { BeveragesInfoWithQuantity, OrderDetails } from '../../types'
import { createAppState } from '../../flux/store/store'
import { ACTION_FETCH_ORDER_DETAILS, ACTION_FETCH_ORDERS, ACTION_FETCH_PIZZA_TYPES } from '../../constants'
import { allActionRegistryClasses  } from '../../AppLogic'
import { ActionService } from '../../flux/actions/ActionService'

const address1_uuid = crypto.randomUUID() 
const user1_uuid = crypto.randomUUID()
const order1_uuid = crypto.randomUUID()
const order1_datetime = '2025-01-01T11:30:00.123'
const pizzaType1_uuid = crypto.randomUUID()
const beverage1_uuid = crypto.randomUUID()
const topping1_uuid = crypto.randomUUID()
const dough1_uuid = crypto.randomUUID()
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
const { stock, ...beverage1_without_stock } = beverage1;
const beverage1_Info : BeveragesInfoWithQuantity = {
    ...beverage1_without_stock,
    quantity : 1
}

const orderDetails1: OrderDetails = {
    pizzaTypes: [pizzaType1],
    beverages: [beverage1_Info, beverage1_Info],
    loading: true,
    error: null
}

const topping1_without_stock = {
    id: topping1_uuid,
    name : 'topping1',
    price : 9.99,
    description : 'topping1 description',
}

const topping1 : ToppingSchema = {
    ...topping1_without_stock,
    stock : 5
}

const dough1_without_stock = { 
    id : dough1_uuid,
    name : 'Dough1',
    description : 'dough1 description',
    price : 5.99,
}

const dough1: DoughSchema = {
    ...dough1_without_stock,
    stock : 10
}

test('fetch Orders Action', async () =>  {
    // arrange
    // use a mock for pizzaBackendService
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getAllOrders : vi.fn( () => 
            new Promise<OrderSchema[]>( resolve => resolve([ order1 ]))),
    }
    const appState = createAppState()
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses );
 
    // act
    await actionService.executeAction({ type : ACTION_FETCH_ORDERS })

    // assert
    expect(appState.pizzaOrdersStore.peek().loading).toBeFalsy()
    expect(appState.pizzaOrdersStore.peek().error).toBeNull()
    expect(appState.pizzaOrdersStore.peek().orders).toEqual( 
        { [order1_uuid] : { ...order1, orderDetails: null, price: null }})
})

test('fetch Order Action with Error', async() => {
     // arrange
    // use a mock for pizzaBackendService
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getAllOrders : vi.fn( () => 
            new Promise<OrderSchema[]>( (resolve, reject) => reject("Error accessing orders"))),
    }
    const appState = createAppState();
    const service  = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses );


    // act
    await actionService.executeAction({ type : ACTION_FETCH_ORDERS })

    // assert
    expect(appState.pizzaOrdersStore.peek().loading).toBeFalsy()
    expect(appState.pizzaOrdersStore.peek().error).toEqual("Error accessing orders")
    expect(appState.pizzaOrdersStore.peek().orders).toEqual({})
    // reset the pizzaStore
})

test('fetch Order Details Action', async () =>  {
    // arrange
    // use a mock for pizzaBackendService
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getListOfPizzaTypesForOrder: vi.fn((orderId : string) => 
            new Promise<JoinedPizzaPizzaTypeSchema[]>( resolve => resolve([ pizzaType1 ]))),
        getListOfBeveragesForOrder : vi.fn((orderId : string) =>
            new Promise<OrderBeverageQuantityCreateSchema[]>(resolve => resolve([ 
                { quantity: 1, beverage_id: beverage1_uuid }, 
                { quantity: 1, beverage_id: beverage1_uuid } ]))),
        getPriceOfOrder: vi.fn((orderId: string) =>
            new Promise<OrderPriceSchema>(resolve => resolve({ price : 42 }))),
        getBeverageDetails : vi.fn((beverageId : string) =>
            new Promise<BeverageSchema>( resolve => resolve(beverage1) ))
    }
    const appState = createAppState();
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses);

    appState.pizzaOrdersStore.value = { orders : { [order1_uuid] : {...order1, orderDetails: null, price :null }},
        loading : false, error : null  };

    // act
    await actionService.executeAction( { type : ACTION_FETCH_ORDER_DETAILS, payload : { orderId : order1_uuid } })

    // assert
    expect(appState.pizzaOrdersStore.peek().loading).toBeFalsy()
    expect(appState.pizzaOrdersStore.peek().error).toBeNull()
    expect(appState.pizzaOrdersStore.peek().orders).toEqual( 
        { [order1_uuid] : { ...order1, 
            orderDetails: { loading: false, pizzaTypes : [ pizzaType1 ], beverages : [ beverage1_Info, beverage1_Info ]}, price: 42.0 }})
    // this tests, if the beverage-uuid cache is working correctly.
    // only get the details for the beverage id once.
    expect(mockedPizzaBackendPort.getBeverageDetails).toHaveBeenCalledOnce()
})

test('fetch Order Details Action with error', async () =>  {
    // arrange
    // use a mock for pizzaBackendService
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getListOfPizzaTypesForOrder: vi.fn((orderId : string) => 
            new Promise<JoinedPizzaPizzaTypeSchema[]>( (resolve,reject) => reject("Cannot access pizzaTypes"))),
        getListOfBeveragesForOrder : vi.fn((orderId : string) =>
            new Promise<OrderBeverageQuantityCreateSchema[]>(resolve => resolve([ 
                { quantity: 1, beverage_id: beverage1_uuid }, 
                { quantity: 1, beverage_id: beverage1_uuid } ]))),
        getPriceOfOrder: vi.fn((orderId: string) =>
            new Promise<OrderPriceSchema>(resolve => resolve({ price : 42 }))),
        getBeverageDetails : vi.fn((beverageId : string) =>
            new Promise<BeverageSchema>( resolve => resolve(beverage1) ))
    }
    
    const appState = createAppState();
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses );
    appState.pizzaOrdersStore.value = { orders : { [order1_uuid] : {...order1, orderDetails: null, price :null }},
        loading : false, error : null  };

    // act
    await actionService.executeAction( { type : ACTION_FETCH_ORDER_DETAILS, payload : { orderId : order1_uuid } })

    // assert
    expect(appState.pizzaOrdersStore.peek().loading).toBeFalsy()
    expect(appState.pizzaOrdersStore.peek().error).toBeNull()
    expect(appState.pizzaOrdersStore.peek().orders[order1_uuid].orderDetails!.error).toEqual("Cannot access pizzaTypes")
})

test('fetch Pizza Types', async () =>  {
    // arrange
    // use a mock for pizzaBackendService
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getPizzaTypes: vi.fn(() => 
            new Promise<PizzaTypeSchema[]>( resolve => resolve([pizzaType1]))),
        getPizzaTypeDough : vi.fn( (pizzaTypeId : string) => 
            Promise.resolve( dough1 ) ),
        getPizzaTypesToppingsList : vi.fn( (pizzaTypeId: string) => 
            new Promise<PizzaTypeToppingQuantityCreateSchema[]>( resolve => resolve( [ 
            { quantity : 1, topping_id : topping1_uuid },  { quantity : 2, topping_id : topping1_uuid }  ] ) )),
        getToppingDetails : vi.fn( (toppingId : string) => 
            new Promise<ToppingSchema>( resolve => resolve(topping1)) )

    }
    const appState = createAppState();
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses );

    
    // act
    await actionService.executeAction( { type : ACTION_FETCH_PIZZA_TYPES })

    // assert
    expect(appState.pizzaTypesStore.peek().loading).toBeFalsy()
    expect(appState.pizzaTypesStore.peek().error).toBeNull()
    expect(appState.pizzaTypesStore.peek().pizzaTypes).toEqual( 
        [ { ...pizzaType1, toppings: [ { ...topping1_without_stock, quantity : 1}, { ...topping1_without_stock, quantity : 2} ],
            dough : { ...dough1_without_stock } }] )
    // this tests, if the topping-uuid cache is working correctly.
    // only get the details for the toppingId once.
    expect(mockedPizzaBackendPort.getToppingDetails).toHaveBeenCalledOnce()
})



