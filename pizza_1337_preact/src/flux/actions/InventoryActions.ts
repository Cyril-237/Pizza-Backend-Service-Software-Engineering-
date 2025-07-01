import { ApiError, BeverageCreateSchema, DoughCreateSchema, ToppingCreateSchema } from "../../api";
import {
    DISPATCH_START_FETCH_BEVERAGES, DISPATCH_FETCH_BEVERAGES_RESULT,
    DISPATCH_FETCH_BEVERAGES_ERROR, DISPATCH_START_FETCH_DOUGHS,
    DISPATCH_FETCH_DOUGHS_RESULT, DISPATCH_FETCH_DOUGHS_ERROR,
    ACTION_FETCH_BEVERAGES, ACTION_FETCH_DOUGHS,
    DISPATCH_FETCH_TOPPINGS_ERROR,
    DISPATCH_FETCH_TOPPINGS_RESULT,
    DISPATCH_START_FETCH_TOPPINGS,
    ACTION_FETCH_TOPPINGS,
    ACTION_UPDATE_BEVERAGE_STOCK,
    ACTION_UPDATE_TOPPING_STOCK,
    ACTION_UPDATE_DOUGH_STOCK,
    ACTION_CREATE_DOUGH,
    ACTION_CREATE_PREMADE_DOUGH,
    ACTION_CREATE_BEVERAGE,
    ACTION_CREATE_PREMADE_BEVERAGE,
    ACTION_DELETE_BEVERAGES,
    ACTION_DELETE_DOUGHS,
    ACTION_DELETE_TOPPINGS,
    ACTION_SERVER_ERROR,
    ACTION_CREATE_PREMADE_TOPPING,
    ACTION_CREATE_TOPPING
} from "../../constants";
import { ActionService, createErrorMessage } from "./ActionService";
import { ActionRegister } from "../../types";
import { reducer } from "../reducer/Reducer";

export class InventoryActions implements ActionRegister {
    private actionService!: ActionService;

    public registerActions(a: ActionService) {
        this.actionService = a;

        this.actionService.register(ACTION_FETCH_BEVERAGES,
            async () => this.fetchBeverages());
        this.actionService.register(ACTION_FETCH_DOUGHS,
            async () => this.fetchDoughs());
        this.actionService.register(ACTION_FETCH_TOPPINGS,
            async () => this.fetchToppings());
        this.actionService.register(ACTION_UPDATE_BEVERAGE_STOCK,
            async (payload: any) => this.updateBeverageStock(payload));
        this.actionService.register(ACTION_UPDATE_TOPPING_STOCK,
            async (payload: any) => this.updateToppingStock(payload));
        this.actionService.register(ACTION_UPDATE_DOUGH_STOCK,
            async (payload: any) => this.updateDoughStock(payload));
        this.actionService.register(ACTION_CREATE_PREMADE_DOUGH,
                async () => this.createPremadeDough());
        this.actionService.register(ACTION_CREATE_DOUGH,
            async (payload : any) => this.createDough(payload));
       this.actionService.register(ACTION_CREATE_PREMADE_TOPPING,
            async () => this.createPremadeTopping());
        this.actionService.register(ACTION_CREATE_TOPPING,
            async (payload: any) => this.createTopping(payload));
        this.actionService.register(ACTION_CREATE_PREMADE_BEVERAGE,
            async () => this.createPremadeBeverage());
            this.actionService.register(ACTION_CREATE_BEVERAGE,
            async (payload : any) => this.createBeverage(payload));
        this.actionService.register(ACTION_DELETE_BEVERAGES,
            async (payload: any) => this.deleteBeverages(payload));
        this.actionService.register(ACTION_DELETE_DOUGHS,
            async (payload: any) => this.deleteDoughs(payload));    
        this.actionService.register(ACTION_DELETE_TOPPINGS,
            async (payload: any) => this.deleteToppings(payload));
        }

    private findFirstUnique = (objects: any[], strings: string[]): string | null => {
        const existingNames = objects.map(obj => obj.name);
        const uniqueString = strings.find(str => !existingNames.includes(str));
        return uniqueString || null;
    }

    private fetchBeverages = async () => {
        reducer.dispatch({ type: DISPATCH_START_FETCH_BEVERAGES }, this.actionService.appState);

        try {
            const beverages = await this.actionService.service.getBeverages();

            reducer.dispatch({ type: DISPATCH_FETCH_BEVERAGES_RESULT, payload: beverages }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_BEVERAGES_ERROR,
                payload: createErrorMessage(error as (ApiError | string))
            }, this.actionService.appState)
        }
    }

    private fetchDoughs = async () => {

        reducer.dispatch({ type: DISPATCH_START_FETCH_DOUGHS }, this.actionService.appState);

        try {
            const doughs = await this.actionService.service.getDoughs();

            reducer.dispatch({ type: DISPATCH_FETCH_DOUGHS_RESULT, payload: doughs }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_DOUGHS_ERROR,
                payload: createErrorMessage(error as (ApiError | string))
            }, this.actionService.appState)
        }
    }

    private fetchToppings = async () => {
        reducer.dispatch({ type: DISPATCH_START_FETCH_TOPPINGS }, this.actionService.appState);

        try {
            const toppings = await this.actionService.service.getToppings();

            reducer.dispatch({ type: DISPATCH_FETCH_TOPPINGS_RESULT, payload: toppings }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_TOPPINGS_ERROR,
                payload: createErrorMessage(error as (ApiError | string))
            }, this.actionService.appState)
        }
    }

    private updateBeverageStock = async (payload: any) => {
        const beverageId: string = payload.id;
        const amount: number = payload.amount;
        try {
            await this.actionService.service.updateBeverageStock(beverageId, amount)
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
        // todo: this could target one individual beverage instead of relading everything ...
        await this.actionService.executeAction({ type: ACTION_FETCH_BEVERAGES });
    }

    private updateToppingStock = async (payload: any) => {
        const toppingId: string = payload.id;
        const amount: number = payload.amount;
        try {
            await this.actionService.service.updateToppingStock(toppingId, amount)
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
        // todo: this coudd target one individual topping instead of relading everything ...
        await this.actionService.executeAction({ type: ACTION_FETCH_TOPPINGS });
    }

    private updateDoughStock = async (payload: any) => {
        const doughId: string = payload.id;
        const amount: number = payload.amount;
        try {
            await this.actionService.service.updateDoughStock(doughId, amount)
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
        // todo: this coudd target one individual dough instead of relading everything ...
        await this.actionService.executeAction({ type: ACTION_FETCH_DOUGHS });
    }

    private deleteBeverages = async (payload: any) => {
        const beverageIds: string[] = payload.beverageIds;
        try {
            await this.actionService.service.deleteBeverages(beverageIds);
            if (payload.doFetch) {
                await this.fetchBeverages();
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }



    private deleteToppings = async (payload: any) => {
        const toppingIds: string[] = payload.toppingIds;
        try {
            await this.actionService.service.deleteToppings(toppingIds);
            if (payload.doFetch) {
                await this.fetchToppings();
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }


    private deleteDoughs = async (payload: any) => {
        const doughIds: string[] = payload.doughIds;
        try {
            await this.actionService.service.deleteDoughs(doughIds);
            if (payload.doFetch) {
                await this.fetchDoughs();
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }


    private createTopping = async (payload: any ) => {

        try {
            const newToppingSchema = await this.actionService.service.createTopping(payload as ToppingCreateSchema);
            await this.fetchToppings();
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }

    }
    private createDough = async (payload : any) => {
        try {
            await this.actionService.service.createDough(payload as DoughCreateSchema);
            await this.fetchDoughs();
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }

    private createBeverage = async (payload : any) => {
        try {
            await this.actionService.service.createBeverage(payload as BeverageCreateSchema);
            await this.fetchBeverages();           
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }




    // Helper Actions to get the store running ...

    private createPremadeTopping = async () => {

        try {
            const toppings = await this.actionService.service.getToppings();
            const defaultToppings = ["Schinken", "Zwiebeln", "Ananas", "Salami", "Pilze", "Mais"]

            const newToppingName = this.findFirstUnique(toppings!, defaultToppings);
            if (newToppingName != null) {
                const newTopping = {
                    name: newToppingName,
                    description: newToppingName + " Topping",
                    price: 1.2,
                    stock: 5
                }
                const newToppingSchema = await this.actionService.service.createTopping(newTopping);
                await this.fetchToppings();
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }

    private  createPremadeDough = async () => {
        try {
            const doughs = await this.actionService.service.getDoughs();
            const defaultDoughs = ["Weizen", "Dinkel", "Vollkorn", "Neapolitan"]

            const newDoughName = this.findFirstUnique(doughs!, defaultDoughs);
            if (newDoughName != null) {
                const newDough = {
                    name: newDoughName,
                    description: newDoughName + " Dough",
                    price: 0.6,
                    stock: 5
                }
                await this.actionService.service.createDough(newDough);
                await this.fetchDoughs();
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }

    private createPremadeBeverage = async () => {
        try {
            const beverages = await this.actionService.service.getBeverages();
            const defaultBeverages = ["Cola", "Fanta", "Bier", "Spezi", "Wasser"]

            const newBeverageName = this.findFirstUnique(beverages!, defaultBeverages);
            if (newBeverageName != null) {
                const newBeverage = {
                    name: newBeverageName,
                    description: newBeverageName + " Beverage",
                    price: 2.8,
                    stock: 12
                }
                await this.actionService.service.createBeverage(newBeverage);
                await this.fetchBeverages();
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }
}
