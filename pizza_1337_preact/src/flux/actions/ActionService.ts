import { ApiError } from "../../api";
import { ACTION_SET_SERVER_ACTION_IN_PROGRESS } from "../../constants";
import { PizzaBackendService } from "../../ports_adapters/services/PizzaBackendService";
import { AppState, ActionRegisterFunctionDependencies, ActionFunction, Action, ActionRegister } from "../../types";

export const createErrorMessage = (error: ApiError | string) =>
    (typeof error === 'object' && error !== null) ?
        `Error ${error.status} ${error.statusText} URL: ${error.url}` :
        error;

export class ActionService {

    private actionQueue : Action[] = [];
  
    constructor(
        public readonly service: PizzaBackendService, 
        public readonly appState : AppState ) {}


    private registry = new Map<string, ActionFunction>();

    register(actionType: string, actionFunction: ActionFunction)  {
        this.registry.set(actionType, actionFunction);
    }

    registerActions(actionClasses : (ActionRegister)[]) {
        actionClasses.forEach( c => c.registerActions(this))
    }

    private getActionFunction(actionType :string ) : ActionFunction | undefined {
        return this.registry.get(actionType);
    }

    reset() {
        this.registry.clear();
    }

    public pushActionIntoQueue( action : Action ) {
        if (!action) return;
        this.actionQueue.push(action);
        while (this.actionQueue.length > 0) {
            this.executeAction(this.actionQueue.pop());
        }
      }
    
    public executeAction = async (action : Action | undefined) : Promise<void>  => {
        if (!action) return;
    
        const actionFunction = this.getActionFunction(action.type);
        if (!actionFunction) {
          console.log("ERROR: executeAction encountered unkwown ", action);
          return;
        }
    
        if (action.finishFunction == undefined) {
          return actionFunction(action.payload);
        }
    
        await this.executeAction( { type : ACTION_SET_SERVER_ACTION_IN_PROGRESS , payload : true });
        await actionFunction(action.payload);
        await this.executeAction( { type : ACTION_SET_SERVER_ACTION_IN_PROGRESS , payload : false });
        
        action.finishFunction();
      }
}