import { FunctionalComponent, h } from "preact";
import { OrderData } from "../types";
import { ShowAndCopyIdComponent } from "./ShowAndCopyIDComponent";

interface OrderDetailsProps {
    order : OrderData
}

export const OrderDetailsComponent : FunctionalComponent<OrderDetailsProps>  =  ( { order } )  => {

    if (order.orderDetails == null) { return <div>No Order Details!</div>}
    if (order.orderDetails.loading) { return <div>Loading Order-Details</div> }

    return <ul>
            {order.orderDetails.pizzaTypes?.map( pizza => (
                <li><ShowAndCopyIdComponent id={pizza.id} type="Pizza-Id" 
                    content={pizza.name}/> 
                    ({pizza.description}). Price: {pizza.price}</li>
            ))}
            {order.orderDetails.beverages?.map( beverage => (
                <li><ShowAndCopyIdComponent id={beverage.id} type="Beverage-Id" 
                    content={beverage.name}/> ({beverage.description}). Quantity: {beverage.quantity}. Price: {beverage.price}</li>
            ))}
        </ul>;

}