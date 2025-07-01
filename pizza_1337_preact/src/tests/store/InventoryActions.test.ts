import { expect, it, vi } from "vitest";
import { ACTION_UPDATE_DOUGH_STOCK } from "../../constants";
import { createAppState } from "../../flux/store/store";
import { PortPizzaBackend } from "../../ports_adapters/ports/PortPizzaBackend";
import { PizzaBackendService } from "../../ports_adapters/services/PizzaBackendService";
import { Action } from "../../types";
import { DoughSchema } from "../../api";
import { allActionRegistryClasses } from "../../AppLogic";
import { ActionService } from "../../flux/actions/ActionService";


const dough1_uuid = crypto.randomUUID()

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

it('should update the Stock of Dough correctly',  async () => {

    // arrange    

    const updateDoughStock = vi.fn();
    const getDoughs = vi.fn();

    const mockedPizzaBackendPort : Partial<PortPizzaBackend> = {
        getDoughs,
        updateDoughStock,
    }
    const appState = createAppState()
    const service = new PizzaBackendService(mockedPizzaBackendPort as PortPizzaBackend);
    const actionService = new ActionService(service, appState);    
    actionService.registerActions( allActionRegistryClasses );
    
    const action : Action = { type: ACTION_UPDATE_DOUGH_STOCK , 
        payload: { id : dough1_uuid, amount: 10 }  }
 

    // act
    await actionService.executeAction( action )

    // assert
    expect(updateDoughStock).toHaveBeenCalledOnce();
    expect(updateDoughStock).toHaveBeenNthCalledWith(1, dough1_uuid,  10);
    expect(getDoughs).toHaveBeenCalledOnce();
})
