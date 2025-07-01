
import { OrderService, OpenAPI, OrderSchema, JoinedPizzaPizzaTypeSchema, 
    OrderBeverageQuantityCreateSchema, BeverageSchema, BeverageService, 
    OrderPriceSchema, BeverageListItemSchema, DoughSchema, 
    DoughService, DoughListItemSchema, ToppingListItemSchema, 
    ToppingService, ToppingSchema, UserService, UserSchema, 
    PizzaTypeService, PizzaTypeSchema, PizzaTypeToppingQuantityCreateSchema, 
    ToppingCreateSchema, DoughCreateSchema, BeverageCreateSchema, 
    PizzaTypeCreateSchema, OrderCreateSchema, PizzaCreateSchema, 
    PizzaWithoutPizzaTypeSchema, UserCreateSchema } from '../../api';
import { PortPizzaBackend } from '../ports/PortPizzaBackend';
import { IdAndQuantity, SimpleAddress } from '../../types';

export class RestAdapterPizzaBackend implements PortPizzaBackend {
    constructor(baseUrl: string = '') {
        OpenAPI.BASE = baseUrl;
    }

    async getAllOrders(): Promise<OrderSchema[]> {
        return OrderService.getAllOrdersV1OrderGet();
    }

    async getPriceOfOrder(orderId: string) : Promise<OrderPriceSchema> {
        return OrderService.getPriceOfOrderV1OrderOrderIdPriceGet(orderId);
    }

    async getListOfPizzaTypesForOrder(orderId : string) : Promise<JoinedPizzaPizzaTypeSchema[]> {
        return OrderService.getPizzasFromOrderV1OrderOrderIdPizzasGet(orderId);
    }

    async getListOfBeveragesForOrder(orderId : string) : Promise<OrderBeverageQuantityCreateSchema[]>  {
        const result = OrderService.getOrderBeveragesV1OrderOrderIdBeveragesGet(orderId, true);
        return result as Promise<OrderBeverageQuantityCreateSchema[]>;
    }

    async getBeverageDetails(beverageId : string) : Promise<BeverageSchema> {
        return BeverageService.getBeverageV1BeveragesBeverageIdGet(beverageId);
    }

    async getBeverages() : Promise<BeverageListItemSchema[]> {
        return BeverageService.getAllBeveragesV1BeveragesGet();
    }

    async getDoughDetails(doughId : string) : Promise<DoughSchema> {
        return DoughService.getDoughV1DoughsDoughIdGet(doughId);
    }
    async getDoughs() : Promise<DoughListItemSchema[]> {
        return DoughService.getAllDoughsV1DoughsGet();
    }

    async getToppingDetails(toppingId : string) : Promise<ToppingSchema> {
        return ToppingService.getToppingV1ToppingsToppingIdGet(toppingId);
    }
    async getToppings() : Promise<ToppingListItemSchema[]> {
        return ToppingService.getAllToppingsV1ToppingsGet();
    }

    async getUsers() : Promise<UserSchema[]> {
        return UserService.getAllUsersV1UsersGet();
    }

    async getPizzaTypes() : Promise<PizzaTypeSchema[]> {
        return PizzaTypeService.getAllPizzaTypesV1PizzaTypesGet();
    }

    async getPizzaTypesToppingsList(pizzaTypeId : string) : Promise<PizzaTypeToppingQuantityCreateSchema[]> {
        const result = PizzaTypeService.getPizzaTypeToppingsV1PizzaTypesPizzaTypeIdToppingsGet(pizzaTypeId, false);
        return result as Promise<PizzaTypeToppingQuantityCreateSchema[]> 
    }

    async getPizzaTypeDough(pizzaTypeId: string) : Promise<DoughSchema> {
        return PizzaTypeService.getPizzaTypeDoughV1PizzaTypesPizzaTypeIdDoughGet(pizzaTypeId)
    }

    async updateBeverageStock(beverageId : string, amount : number) : Promise<BeverageSchema> {
        const beverage = await this.getBeverageDetails(beverageId);
        beverage.stock += amount
        return BeverageService.updateBeverageV1BeveragesBeverageIdPut(beverageId,beverage)
    }

    async updateToppingStock(toppingId : string, amount : number) : Promise<ToppingSchema> {
        const topping = await this.getToppingDetails(toppingId);
        topping.stock += amount
        return ToppingService.updateToppingV1ToppingsToppingIdPut(toppingId,topping)
    }

    async updateDoughStock(doughId : string, amount : number) : Promise<DoughSchema> {
        const dough = await this.getDoughDetails(doughId);
        dough.stock += amount
        return DoughService.updateDoughV1DoughsDoughIdPut(doughId,dough)
    }

    async createTopping(topping: ToppingCreateSchema): Promise<ToppingSchema> {
        return ToppingService.createToppingV1ToppingsPost(topping);
    }

    async createDough(dough: DoughCreateSchema): Promise<DoughSchema> {
        return DoughService.createDoughV1DoughsPost(dough)
    }

    async createBeverage(beverage: BeverageCreateSchema): Promise<BeverageSchema> {
        return BeverageService.createBeverageV1BeveragesPost(beverage);
    }

    // todo -> handle cases with error? Type exists, toppings change ....
    async createPizzaType(name : string,
            price: number,
            doughId: string,
            toppings: IdAndQuantity[]) : Promise<PizzaTypeSchema>  {

        const pizzaTypeCreateSchema : PizzaTypeCreateSchema = {
            name,
            price,
            description : name + " Pizzatype",
            dough_id : doughId
        }
        const pizzaTypeSchema = await PizzaTypeService.createPizzaTypeV1PizzaTypesPost(  pizzaTypeCreateSchema )

        await Promise.all( toppings.map( (t) : Promise<PizzaTypeToppingQuantityCreateSchema> => {

            const pizzaTypeToppingCreateSchema = {
                topping_id : t.id,
                quantity : t.quantity
            }
            return PizzaTypeService.createPizzaTypeToppingV1PizzaTypesPizzaTypeIdToppingsPost(pizzaTypeSchema.id, pizzaTypeToppingCreateSchema)
        }));
        return pizzaTypeSchema;
    }

    async createOrder(userId : string, 
        address : SimpleAddress, 
        pizzaTypes : IdAndQuantity[], 
        beverages: IdAndQuantity[] ) : Promise<OrderSchema> {
        const orderCreateSchema : OrderCreateSchema = {
            address: {
                street: address.street,
                post_code: '1234',
                house_number: Number(address.houseNumber),
                country: '',
                town: address.town,
                first_name: 'Some',
                last_name: 'User'
            },
            user_id: userId
        };
        
        const newOrder : OrderSchema = await OrderService.createOrderV1OrderPost(orderCreateSchema);

        const beverage_promisses  = beverages.map( b => {
            const orderBeverageQuantity = {
                quantity: b.quantity,
                beverage_id: b.id
            };
            return OrderService.createOrderBeverageV1OrderOrderIdBeveragesPost(newOrder.id,orderBeverageQuantity);
         });
         const pizza_types_promisses : Promise<PizzaWithoutPizzaTypeSchema>[] = [];
         pizzaTypes.forEach( pt => {
            for (let i = 0; i< pt.quantity;i++) {
                const pizzaCreateSchema : PizzaCreateSchema = {
                    pizza_type_id: pt.id
                }
                pizza_types_promisses.push(OrderService.addPizzaToOrderV1OrderOrderIdPizzasPost(newOrder.id, pizzaCreateSchema));
            }
         })

        await Promise.all( [ ...beverage_promisses, ...pizza_types_promisses ]);      
        return newOrder;

    }

    async createUser( userData : UserCreateSchema ) : Promise<UserSchema> {
        return UserService.createUserV1UsersPost(userData);
    }

    
    async deleteOrders( orderIds : string[] )  {
        return Promise.all(orderIds.map( (orderId)  => 
            OrderService.deleteOrderV1OrderOrderIdDelete(orderId)
        ))        
    }

    async deletePizzaTypes( pizzaTypeIds : string[] )  {
        return Promise.all(pizzaTypeIds.map( (pizzaTypeId) => 
            PizzaTypeService.deletePizzaTypeV1PizzaTypesPizzaTypeIdDelete(pizzaTypeId)
        ))        
    }

    async deleteBeverages( beveragesIds : string[] ) {
        return Promise.all(beveragesIds.map( (beverageId)  => 
            BeverageService.deleteBeverageV1BeveragesBeverageIdDelete(beverageId)
        ))        
    }

    async deleteToppings( toppingIds : string[] ) {
        return Promise.all(toppingIds.map( (toppingId)  => 
            ToppingService.deleteToppingV1ToppingsToppingIdDelete(toppingId)
        ))        
    }

    async deleteDoughs( doughIds : string[] ) {
        return Promise.all(doughIds.map( (doughId)  => 
            DoughService.deleteDoughV1DoughsDoughIdDelete(doughId)
        ))        
    }



}

