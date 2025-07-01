import { expect, it, vi } from 'vitest'
import { Action } from '../../types';
import { ACTION_DELETE_ALL, ACTION_FETCH_ALL_AWAIT, ACTION_FETCH_ORDERS, 
    ACTION_SET_SERVER_ACTION_IN_PROGRESS } from '../../constants';
import { PortPizzaBackend } from '../../ports_adapters/ports/PortPizzaBackend';
import { createAppState } from '../../flux/store/store';
import { PizzaBackendService } from '../../ports_adapters/services/PizzaBackendService';
import {  allActionRegistryClasses } from '../../AppLogic';
import { AddressSchema, OrderSchema, OrderStatus } from '../../api';
import { ActionService } from '../../flux/actions/ActionService';

const address1_uuid = crypto.randomUUID() 
const user1_uuid = crypto.randomUUID()
const order1_uuid = crypto.randomUUID()
const order1_datetime = '2025-01-01T11:30:00.123'
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


it('should invoke the finish Function after an async fetch_all_await action ' +
    ' and set serverActionInProgress', 
    async () => {

    // arrange    
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getAllOrders : () =>  new Promise( resolve => resolve([ order1 ])),
        getBeverages : () =>  new Promise( resolve => resolve([  ])),
        getDoughs : () =>  new Promise( resolve => resolve([  ])),
        getToppings : () =>  new Promise( resolve => resolve([  ])),
        getPizzaTypes : () =>  new Promise( resolve => resolve([  ])),
        getUsers : () =>  new Promise( resolve => resolve([  ])),
    }
    const appState = createAppState()
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses );
    

    const serverActionFunction = vi.fn();
    actionService.register( ACTION_SET_SERVER_ACTION_IN_PROGRESS, 
        async (payload : any) => {
            serverActionFunction(payload);
        }
    )
    const finishFunction = vi.fn();
    const action : Action = { type: ACTION_FETCH_ALL_AWAIT , finishFunction  }
 

    // act
    await actionService.executeAction( action )

    // assert
    expect(finishFunction).toHaveBeenCalled();
    expect(appState.systemStore.peek().serverActionInProgress).toBeFalsy();
    expect(serverActionFunction).toHaveBeenCalledTimes(2);
    expect(serverActionFunction).toHaveBeenNthCalledWith(1,true);
    expect(serverActionFunction).toHaveBeenNthCalledWith(2,false);
    expect(appState.pizzaOrdersStore.peek().orders).toEqual(
        { [order1_uuid] : { ...order1, price: null, orderDetails : null }} )
})

it('should set serverActionInProgress with finishFunction', async () => {
    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getAllOrders : () =>  new Promise( resolve => resolve([ order1 ])),
    }
    const appState = createAppState()
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    actionService.registerActions( allActionRegistryClasses );

    const serverActionFunction = vi.fn();
    actionService.register( ACTION_SET_SERVER_ACTION_IN_PROGRESS, 
        async (payload : any) => {
            serverActionFunction(payload);
        }
    )
    
    const finishFunction = vi.fn();
    const action : Action = { type: ACTION_FETCH_ORDERS , finishFunction  }
 

    // act
    await actionService.executeAction( action )

    // assert
    expect(finishFunction).toHaveBeenCalled();
    expect(appState.systemStore.peek().serverActionInProgress).toBeFalsy();
    expect(serverActionFunction).toHaveBeenCalledTimes(2);
    expect(serverActionFunction).toHaveBeenNthCalledWith(1,true);
    expect(serverActionFunction).toHaveBeenNthCalledWith(2,false);
    expect(appState.pizzaOrdersStore.peek().orders).toEqual(
        { [order1_uuid] : { ...order1, price: null, orderDetails : null }} )

})

class Counter {
    value : number = 0;
    getNextValue = () => {
        return ++this.value;
    }
}

it ('should do the delete in the correct order', async () => {
    // arrange    

    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getAllOrders : () =>  new Promise( resolve => resolve([  ])),
        deleteOrders : vi.fn(),
        deleteBeverages : (orderIds) => new Promise( resolve =>  resolve([])  ),
        getBeverages : () =>  new Promise( resolve => resolve([  ])),
        deleteDoughs : (orderIds) => new Promise( resolve => resolve([]) ),
        getDoughs : () =>  new Promise( resolve => resolve([  ])),
        deleteToppings : (orderIds) => new Promise( resolve => resolve([]) ),
        getToppings : () =>  new Promise( resolve => resolve([  ])),
        deletePizzaTypes : (orderIds) => new Promise( resolve => resolve([]) ),
        getPizzaTypes : () =>  new Promise( resolve => resolve([  ])),
        getUsers : () =>  new Promise( resolve => resolve([  ])),
    }
    const appState = createAppState()
    appState.pizzaOrdersStore.value.orders = { [order1_uuid] : { ...order1, price: null, orderDetails : null } }
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);
    
    const origExecute = actionService.executeAction;
    const mockExecute = vi.spyOn(actionService, 'executeAction')
    const executionCallCount : { [key:string] : number} = {}
    const counter = new Counter();
    mockExecute.mockImplementation(async (action) => {
      executionCallCount[action!.type] = counter.getNextValue();
      return origExecute.apply(actionService,[action]);   
    })
    actionService.registerActions( allActionRegistryClasses);

    const serverActionFunction = vi.fn();
    actionService.register( ACTION_SET_SERVER_ACTION_IN_PROGRESS, 
        async (payload : any) => {
            serverActionFunction(payload);
        }
    )
    
    const finishFunction = vi.fn();
    const action : Action = { type: ACTION_DELETE_ALL , finishFunction  }
 

    // act
    await actionService.executeAction( action )

    // assert
    mockExecute.mockRestore()

    expect(finishFunction).toHaveBeenCalled();
    expect(appState.systemStore.peek().serverActionInProgress).toBeFalsy();
    expect(serverActionFunction).toHaveBeenCalledTimes(2);
    expect(serverActionFunction).toHaveBeenNthCalledWith(1,true);
    expect(serverActionFunction).toHaveBeenNthCalledWith(2,false);

    expect(executionCallCount['ACTION_DELETE_ALL']).is.lessThan(
        executionCallCount['ACTION_DELETE_ORDERS'])

    expect(executionCallCount['ACTION_DELETE_ORDERS']).is.lessThan(
        executionCallCount['ACTION_DELETE_PIZZA_TYPES'])
    
    expect(executionCallCount['ACTION_DELETE_PIZZA_TYPES']).is.lessThan(
        executionCallCount['ACTION_DELETE_BEVERAGES'])

    expect(executionCallCount['ACTION_DELETE_PIZZA_TYPES']).is.lessThan(
        executionCallCount['ACTION_DELETE_TOPPINGS'])

    expect(executionCallCount['ACTION_DELETE_PIZZA_TYPES']).is.lessThan(
        executionCallCount['ACTION_DELETE_DOUGHS'])

    expect(executionCallCount['ACTION_FETCH_ORDERS']).is.greaterThan(
            executionCallCount['ACTION_DELETE_DOUGHS'])

    expect( mockedPizzaBackendPort.deleteOrders).toHaveBeenCalledWith( [ order1_uuid ])
    expect( appState.pizzaOrdersStore.value.orders ).toEqual( {})
})