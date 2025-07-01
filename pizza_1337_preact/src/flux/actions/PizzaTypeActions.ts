import { DoughSchema, ApiError } from "../../api";
import { ActionService, createErrorMessage } from "./ActionService";
import {
    DISPATCH_START_FETCH_PIZZA_TYPES, DISPATCH_FETCH_PIZZA_TYPES_RESULT,
    DISPATCH_FETCH_PIZZA_TYPES_ERROR, ACTION_FETCH_PIZZA_TYPES,
    ACTION_CREATE_PIZZA_TYPE, ACTION_DELETE_PIZZA_TYPES,
    ACTION_DELETE_PIZZA_TYPES_AND_FETCH,
    ACTION_SERVER_ERROR,
    ACTION_FETCH_DOUGHS,
    ACTION_FETCH_TOPPINGS,
    ACTION_FETCH_PIZZA_TYPE_CREATE_DATA,
} from "../../constants";
import { ActionRegister } from "../../types";
import { reducer } from "../reducer/Reducer";

export class PizzaTypeActions implements ActionRegister {
    private actionService!: ActionService;

    public registerActions = (a: ActionService) => {
        this.actionService = a;

        this.actionService.register(ACTION_FETCH_PIZZA_TYPES,
            async () => this.fetchPizzaTypes())

        this.actionService.register(ACTION_FETCH_PIZZA_TYPE_CREATE_DATA,
            async () => {
                await Promise.all([
                    this.actionService.executeAction({ type: ACTION_FETCH_DOUGHS }),
                    this.actionService.executeAction({ type: ACTION_FETCH_TOPPINGS })
                ])
            })
        this.actionService.register(ACTION_CREATE_PIZZA_TYPE,
            async (payload: any) => {
                await this.createPizzaType(payload)
                this.fetchPizzaTypes();
            })

        this.actionService.register(ACTION_DELETE_PIZZA_TYPES,
            async (payload: any) => this.deletePizzaTypes(payload))

        this.actionService.register(ACTION_DELETE_PIZZA_TYPES_AND_FETCH,
            async (payload: any) => {
                await this.deletePizzaTypes(payload)
                await this.fetchPizzaTypes();
            })
    }


    private fetchPizzaTypeToppings = async (pizzaTypeId: string) => {
        const pizzaTypeToppings
            = await this.actionService.service.getPizzaTypesToppingsList(pizzaTypeId);

        return Promise.all(
            pizzaTypeToppings.map(async pt => {
                const toppingInfo =
                    await this.actionService.service.getToppingsCache(pt.topping_id);
                return { id: pt.topping_id, quantity: pt.quantity, ...toppingInfo }
            }));
    }

    private getDoughInfo = (dough: DoughSchema) => {
        return { id: dough.id, name: dough.name, description: dough.description, price: dough.price }
    }

    private fetchPizzaTypes = async () => {
        reducer.dispatch({ type: DISPATCH_START_FETCH_PIZZA_TYPES }, this.actionService.appState);

        try {
            const pizzaTypeSchemas = await this.actionService.service.getPizzaTypes()

            const promises = pizzaTypeSchemas.map(async (pizzaType, index) => {

                const [toppings, doughWithStock] = await Promise.all([
                    this.fetchPizzaTypeToppings(pizzaType.id),
                    this.actionService.service.getPizzaTypeDough(pizzaType.id)
                ])
                const dough = this.getDoughInfo(doughWithStock)
                return { ...pizzaTypeSchemas[index], toppings, dough }
            })

            const pizzaTypeSchemasWithToppingsAndDough =
                await Promise.all(promises)

            reducer.dispatch({
                type: DISPATCH_FETCH_PIZZA_TYPES_RESULT,
                payload: pizzaTypeSchemasWithToppingsAndDough
            }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_PIZZA_TYPES_ERROR,
                payload: createErrorMessage(error as (ApiError | string))
            }, this.actionService.appState)
        }
    }

    private createPizzaType = async (payload: any) => {

        const { name, price, doughId, toppings } = payload;
        try {
            await this.actionService.service.createPizzaType(name, price, doughId, toppings);
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }

    private deletePizzaTypes = async (payload: any) => {
        const pizzaTypeIds: string[] = payload.pizzaTypeIds;
        try {
            await this.actionService.service.deletePizzaTypes(pizzaTypeIds);
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }

}
