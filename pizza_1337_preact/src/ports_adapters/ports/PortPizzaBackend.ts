import type { BeverageCreateSchema, BeverageListItemSchema, BeverageSchema, DoughCreateSchema, DoughListItemSchema, DoughSchema, 
    JoinedPizzaPizzaTypeSchema, OrderBeverageQuantityCreateSchema, OrderPriceSchema, 
    OrderSchema, PizzaTypeSchema, PizzaTypeToppingQuantityCreateSchema, ToppingCreateSchema,
     ToppingListItemSchema, ToppingSchema, UserCreateSchema, UserSchema } from '../../api'
import { IdAndQuantity, SimpleAddress } from '../../types';

export interface PortPizzaBackend {

    getAllOrders(): Promise<OrderSchema[]>;
    getListOfPizzaTypesForOrder(orderId : string) : Promise<JoinedPizzaPizzaTypeSchema[]>;
    getListOfBeveragesForOrder(orderId : string) : Promise<OrderBeverageQuantityCreateSchema[]>;
    getPriceOfOrder(orderId: string) : Promise<OrderPriceSchema>;

    getBeverageDetails(beverageId : string) : Promise<BeverageSchema>;
    getBeverages() : Promise<BeverageListItemSchema[]>;

    getDoughDetails(doughId : string) : Promise<DoughSchema>;
    getDoughs() : Promise<DoughListItemSchema[]>; 

    getToppingDetails(toppingId : string) : Promise<ToppingSchema>;
    getToppings() : Promise<ToppingListItemSchema[]>;
    
    getUsers() : Promise<UserSchema[]>;
    
    getPizzaTypes() : Promise<PizzaTypeSchema[]>;
    getPizzaTypesToppingsList(pizzaTypeId : string) : Promise<PizzaTypeToppingQuantityCreateSchema[]>;
    getPizzaTypeDough(pizzaTypeId: string) : Promise<DoughSchema>;

    updateBeverageStock(beverageId : string, amount : number) : Promise<BeverageSchema>;
    updateToppingStock(toppingId : string, amount : number) : Promise<ToppingSchema>;
    updateDoughStock(doughId : string, amount : number) : Promise<DoughSchema>;

    createTopping(topping : ToppingCreateSchema): Promise<ToppingSchema>;
    createDough(dough : DoughCreateSchema): Promise<DoughSchema>;
    createBeverage(beverage : BeverageCreateSchema): Promise<BeverageSchema>;

    createPizzaType(name : string,
        price: number,
        doughId: string,
        toppings: IdAndQuantity[]) : Promise<PizzaTypeSchema> ;

    createOrder( userId : string,
        address : SimpleAddress,
        pizzasWithQuantities : IdAndQuantity[],
        beveragesWithQuantity : IdAndQuantity[]
    ) : Promise<OrderSchema>;

     createUser ( userData : UserCreateSchema ) : Promise<UserSchema>;

     deleteOrders ( ordersIds : string[] ) : Promise<void[]>;
     deletePizzaTypes ( pizzaTypeIds : string[] ) : Promise<void[]>;

     deleteBeverages( beverageIds : string[] ) : Promise<void[]>;
     deleteToppings( toppingIds : string[] ) : Promise<void[]>;
     deleteDoughs( doughIds : string[] ) : Promise<void[]>;
}