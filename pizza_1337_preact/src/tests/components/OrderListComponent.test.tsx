import { h } from 'preact';
import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderListComponent } from '../../components/OrderListComponent';
import { signal } from '@preact/signals';
import { AppState, BeveragesInfoWithQuantity, OrderDetails, PizzaOrdersStoreState } from '../../types';
import { AddressSchema, BeverageSchema, OrderSchema, OrderStatus, PizzaTypeSchema, UserSchema } from '../../api';
import { ACTION_FETCH_ORDER_CREATE_DATA, ACTION_FETCH_ORDERS, ACTION_FETCH_USERS } from '../../constants';
import { createAppState } from '../../flux/store/store';
import { AppStateContext } from '../../AppLogic';

describe('OrderListComponent', () => {
    const mockPushAction = vi.fn();

    // Create mock store states
    const appState = createAppState();

    beforeEach(() => {
        // Clear mock function calls before each test
        mockPushAction.mockClear();
    });

    it('does not call pushAction with FETCH_ORDERS on mount', () => {
        render(
            <AppStateContext.Provider value={ { appState, pushActionIntoQueue : mockPushAction } }>
            <OrderListComponent />
            </AppStateContext.Provider>
        );

        expect(mockPushAction).not.toHaveBeenCalled();
    });

    it('shows the OrderCreateDialog', async () => {
        const { container } = render(
            <AppStateContext.Provider value={ { appState, pushActionIntoQueue : mockPushAction } }>
            <OrderListComponent />
            </AppStateContext.Provider>
        );

        const button = screen.getByRole('button')
        fireEvent.click(button);

        expect(mockPushAction).toHaveBeenCalled();
        const { type, finishFunction } = mockPushAction.mock.calls[0][0]
        expect(type).toEqual( ACTION_FETCH_ORDER_CREATE_DATA )
        finishFunction();

        await new Promise( resolve => setTimeout(resolve,0));

        expect(document.querySelector('[data-testid="create-order-dialog"]'))

        const cancel = screen.getByText('Cancel')
        fireEvent.click(cancel);
    })



    it('shows loading state', () => {
        const loadingAppState : AppState = { ...appState,
                pizzaOrdersStore : signal( { ...appState.pizzaOrdersStore.value, loading : true}) }
        render(
            <AppStateContext.Provider value={ { appState : loadingAppState, pushActionIntoQueue : mockPushAction } }>
            <OrderListComponent />
            </AppStateContext.Provider>
        );

        const overlayElement = screen.getByTestId('loading-overlay');
        expect(overlayElement).toBeInTheDocument();
    });

    it('shows error state', () => {
        const errorMessage = 'Failed to fetch orders';
        const errorAppState : AppState = { ...appState, 
            pizzaOrdersStore  : signal({ ...appState.pizzaOrdersStore.value, error : errorMessage}) }

        render(
            <AppStateContext.Provider value={ { appState : errorAppState, pushActionIntoQueue : mockPushAction } }>
            <OrderListComponent />
            </AppStateContext.Provider>
        );

        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    const address1_uuid = 'adress-id-1' // todo: use UUID to be a valid datatype
    const user1_uuid = 'user-id-1'
    const order1_uuid = 'oder-id-1'
    const order1_datetime = '2025-01-01T11:30:00.123'
    const pizzaType1_uuid = 'pizzaType-id-1'
    const beverage1_uuid = 'beverage-id-1'
    
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
        user_id: user1_uuid, // todo: use UUID to be a valid datatype
        order_status: OrderStatus.TRANSMITTED,
        id: order1_uuid, // todo: use UUID to be a valid datatype
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
        loading: false,
        error: null
    }
    const baseStore = createAppState();
    const appStoreWithOrders = { ...baseStore,
        pizzaOrdersStore: signal({
            orders: { [order1_uuid] : { ...order1, orderDetails: orderDetails1, price : 12.0 }  },
            loading: false,
            error: null
        } as PizzaOrdersStoreState),
        usersStore: signal({
            users : [ { id : user1_uuid, username : "Casper Jones"} ] as UserSchema[],
            loading: false,
            error: null
        })
    };
    it('shows the order component including order details', () => {
        const { container } = render(
            <AppStateContext.Provider value={ { appState : appStoreWithOrders, pushActionIntoQueue : mockPushAction } }>
            <OrderListComponent />
            </AppStateContext.Provider>
        );

        expect(screen.getByText("Funghi")).toBeInTheDocument();
        
        expect(screen.getByText("Casper Jones")).toBeInTheDocument();
    
        // We have two Green Tea Elements
        const element = screen.getAllByText("Green Tea");
        expect(element).toHaveLength(2);
        element.forEach( e => expect(e).toBeInTheDocument() )

         

        // orderDetails are present ...
        expect(mockPushAction).not.toHaveBeenCalled();

        // we want the order component to be visible with the correct order and user-id ..

        // console.log(mockPushAction.mock.calls);

    })

});
