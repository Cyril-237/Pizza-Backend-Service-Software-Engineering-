import { BeverageCreateSchema, BeverageSchema, DoughCreateSchema, 
    ToppingCreateSchema, ToppingSchema, 
    UserCreateSchema  } from "../../api";
import { PortPizzaBackend } from "../ports/PortPizzaBackend";
import { IdAndQuantity, NameDescriptionPriceCache, SimpleAddress, ToppingInfo } from "../../types";

export class PizzaBackendService {
    constructor(private port: PortPizzaBackend) {}

    beveragesCache : NameDescriptionPriceCache = {}
    toppingsCache : NameDescriptionPriceCache = {}

    async createUser( userCreateData : UserCreateSchema) {
        return this.port.createUser(userCreateData);
    }
    async createOrder( userId : string,
        address : SimpleAddress,
        pizzasWithQuantities : IdAndQuantity[],
        beveragesWithQuantity : IdAndQuantity[]
    ) {
        return this.port.createOrder(userId,address,pizzasWithQuantities,beveragesWithQuantity);
    }
    async createPizzaType(name : string,
        price: number,
        doughId: string,
        toppings: IdAndQuantity[]) {
            return this.port.createPizzaType( name, price, doughId, toppings);
        }

    async getOrders()  {
        return this.port.getAllOrders();
    }

    async getListOfPizzaTypesForOrder(orderId : string)  {
        return this.port.getListOfPizzaTypesForOrder(orderId);
    } 

    async getListOfBeveragesForOrder(orderId : string) {
        return this.port.getListOfBeveragesForOrder(orderId);
    }

    async getOrderPrice(orderId: string) {
        return this.port.getPriceOfOrder(orderId);
    }

    async getBeveragesCache(beverageId : string) {
        if (this.beveragesCache[beverageId] != null) {
            return this.beveragesCache[beverageId];
        }
        this.getBeverageDetails(beverageId)
        return this.beveragesCache[beverageId]
    }

    convertBeverageSchemaToCache(beverage : BeverageSchema) {
        return { id: beverage.id, name: beverage.name, 
            description : beverage.description, 
            price: beverage.price };
    }

    async getBeverageDetails(beverageId : string) {
        const beverageDetail  = 
            this.port.getBeverageDetails(beverageId)
        this.beveragesCache[beverageId] = beverageDetail.then(this.convertBeverageSchemaToCache )
        return beverageDetail;
    }

    async getBeverages()  {
        const beverageItemList = await this.port.getBeverages();
        return Promise.all(
            beverageItemList.map( (beverageListItem)  => 
                this.port.getBeverageDetails(beverageListItem.id)
            )
        );
    }    

    async getDoughs()  {
        const doughItemList = await this.port.getDoughs();
        return Promise.all(
            doughItemList.map( (doughListItem)  => 
                this.port.getDoughDetails(doughListItem.id)
            )
        );
    } 
    
    async getToppingsCache(toppingsId : string) {
        if (this.toppingsCache[toppingsId] != null) {
            return this.toppingsCache[toppingsId];
        }
        this.getToppingDetails(toppingsId)
        return this.toppingsCache[toppingsId];
    }

    convertToppingSchemaToCache(topping : ToppingSchema) : ToppingInfo {
        return { id: topping.id, name: topping.name, 
            description : topping.description, price: topping.price };
    }
    async getToppingDetails(toppingId: string)  {

        const toppingDetail  = 
            this.port.getToppingDetails(toppingId)
        this.toppingsCache[toppingId] = toppingDetail.then( this.convertToppingSchemaToCache )
        return toppingDetail;
    }
    async getToppings()  {
        const toppingsItemList = await this.port.getToppings();
        return Promise.all(
            toppingsItemList.map( (toppingListItem)  => 
                this.getToppingDetails(toppingListItem.id)
            ))
    }    

    async getPizzaTypes() {
        return this.port.getPizzaTypes();
    }

    async getPizzaTypeDough(pizzaTypeId: string) {
        return this.port.getPizzaTypeDough(pizzaTypeId);
    }

    async getPizzaTypesToppingsList(pizzaTypeId : string)  {
        return this.port.getPizzaTypesToppingsList(pizzaTypeId); 
    }

    async getUsers() {
        return this.port.getUsers();
    }

    async updateBeverageStock(beverageId : string, amount : number) {
        return this.port.updateBeverageStock(beverageId,amount);
    }

    async updateToppingStock(toppingId : string, amount : number) {
        return this.port.updateToppingStock(toppingId,amount);
    }
    async updateDoughStock(doughId : string, amount : number) {
        return this.port.updateDoughStock(doughId,amount);
    }

    async createTopping(topping : ToppingCreateSchema) {
        return this.port.createTopping(topping);
    }

    async createDough(dough : DoughCreateSchema)  {
        return this.port.createDough(dough);
    }
    async createBeverage(beverage : BeverageCreateSchema)  {
        return this.port.createBeverage(beverage);
    }

    async deleteOrders( orderIds : string[])  {
        return this.port.deleteOrders(orderIds);
    }

    async deletePizzaTypes( pizzaTypeIds : string[])  {
        return this.port.deletePizzaTypes(pizzaTypeIds);
    }

    async deleteBeverages ( beverageIds : string[] )  {
        return this.port.deleteBeverages(beverageIds);
    }

    async deleteToppings ( toppingIds : string[] )  {
        return this.port.deleteToppings(toppingIds);
    }

    async deleteDoughs ( doughIds : string[] )  {
        return this.port.deleteDoughs(doughIds);
    }
}
