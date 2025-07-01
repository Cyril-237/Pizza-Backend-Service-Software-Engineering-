import { h, FunctionalComponent } from "preact";
import { PizzaTypeSchemaWithToppingsAndDough} from "../types"
import { ShowAndCopyIdComponent } from "./ShowAndCopyIDComponent";

interface PizzaTypeProps {
    pizzaType : PizzaTypeSchemaWithToppingsAndDough;
}

export const PizzaTypeComponent : FunctionalComponent<PizzaTypeProps> = ( { pizzaType } ) => {

    return <div className="card">
      <ShowAndCopyIdComponent id={pizzaType.id} type="PizzaType-Id" content={pizzaType.name}/>
          ({pizzaType.description}). Price: {pizzaType.price}
      <h3>Dough</h3>
        <ShowAndCopyIdComponent id={pizzaType.dough.id} type="Dough-Id" content={pizzaType.dough.name} />
        ({pizzaType.dough.description}) Price: {pizzaType.dough.price}
      <h3>Toppings:</h3>
      <ul>
        {pizzaType.toppings.map( topping => 
        <li key={topping.id}>
            <ShowAndCopyIdComponent id={topping.id} type="Topping-Id" content={topping.name}/>
            ({topping.description}) Quantity: {topping.quantity} Price: {topping.price}
        </li>)}
      </ul>
    </div>
}
