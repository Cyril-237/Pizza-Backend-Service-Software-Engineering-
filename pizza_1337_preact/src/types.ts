import { Signal } from "@preact/signals";
import { OrderSchema, JoinedPizzaPizzaTypeSchema, BeverageSchema, 
    DoughSchema, PizzaTypeSchema, ToppingSchema, UserSchema,  
    ApiError} from "./api";
import { PizzaBackendService } from "./ports_adapters/services/PizzaBackendService";
import { ActionService } from "./flux/actions/ActionService";

// export type DispatchFunction = (action: ActionResult, appState : AppState) => void;

export type ReducerFunction = (action : ActionResult, appState : AppStateContent) => AppStateChange ;
export type ReducerFunctionsMapType = { [key: string] : ReducerFunction };

export type FinishFunction = () => any;
export type ActionFunction = (payload : any ) => Promise<void>;

export type ActionResult = { type: string, payload?: any };
export type Action = ActionResult &  { finishFunction? : FinishFunction };

export interface ActionRegister  {
    registerActions( a: ActionService ) : any;
}

export type pushActionFunction = (action:Action) => void;

export type ActionRegisterFunctionDependencies = {
    service : PizzaBackendService
    appState : AppState
}

export type NameDescriptionPrice = {
    name: string
    description: string
    price : number
}

export type NameDescriptionPriceCache = { [key:string] : Promise<NameDescriptionPrice> };

export type BeveragesInfo = { id: string } & NameDescriptionPrice;

export type BeveragesInfoWithQuantity = BeveragesInfo & 
    { quantity : number }

export interface OrderDetails  {
    pizzaTypes : JoinedPizzaPizzaTypeSchema[] | null
    beverages : BeveragesInfoWithQuantity[] | null
    loading : boolean
    error : string | null 
}

export const startOrderDetails : OrderDetails = 
    { loading: true } as OrderDetails;

export interface OrderData extends OrderSchema {
    orderDetails: OrderDetails | null 
    price : number | null 
}

export type OrderMap = {  [ key : string ] : OrderData }

export interface PizzaOrdersStoreState {
    orders : OrderMap
    loading : boolean
    error : string | null
}

export interface BeveragesStoreState {
    beverages : BeverageSchema[]
    loading : boolean
    error : string | null 
}  

export interface DoughsStoreState {
    doughs : DoughSchema[]
    loading : boolean
    error : string | null 
}  

export interface SystemStoreState {
    errors : (ApiError | string)[]
    serverActionInProgress? : boolean 
}

export type IdAndQuantity = {
    id : string
    quantity : number 
}

export type PizzaTypeTopping = IdAndQuantity & NameDescriptionPrice;
export type DoughInfo = NameDescriptionPrice & { id: string }

export type PizzaTypeSchemaWithToppingsAndDough = PizzaTypeSchema & {
    dough: DoughInfo
    toppings : PizzaTypeTopping[]
} 

export interface PizzaTypesStoreState {
    pizzaTypes : PizzaTypeSchemaWithToppingsAndDough[]
    loading : boolean
    error : string | null 
}

export type ToppingInfo = { id: string } & NameDescriptionPrice;

export interface ToppingsStoreState {
    toppings : ToppingSchema[]
    loading : boolean
    error : string | null 
}

export interface UsersStoreState {
    users : UserSchema[]
    loading : boolean
    error : string | null 
} 

export interface SimpleAddress {
    name: string,
    street: string, 
    houseNumber: string,
    town: string   
}

export type AppState = {
    pizzaOrdersStore : Signal<PizzaOrdersStoreState>;
    toppingsStore : Signal<ToppingsStoreState>;
    pizzaTypesStore : Signal<PizzaTypesStoreState>;
    beveragesStore : Signal<BeveragesStoreState>;
    usersStore : Signal<UsersStoreState>;
    doughsStore : Signal<DoughsStoreState>;
    systemStore : Signal<SystemStoreState>;
}

export type AppStateContent = {
    pizzaOrdersStore : PizzaOrdersStoreState
    toppingsStore : ToppingsStoreState;
    pizzaTypesStore : PizzaTypesStoreState;
    beveragesStore : BeveragesStoreState;
    usersStore : UsersStoreState;
    doughsStore : DoughsStoreState;
    systemStore : SystemStoreState;
}

export type AppStateChange = AppStateContent;

export type AppStateContextValue = {
    appState : AppState,
    pushActionIntoQueue : (action : Action) => void
}