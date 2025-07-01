import { FunctionComponent } from "preact";
import { OrderDetailsComponent } from "./OrderDetailsComponent";
import { useContext, useEffect } from "preact/hooks";
import { ACTION_DELETE_ORDERS_AND_FETCH, ACTION_FETCH_ORDER_DETAILS } from "../constants";
import { OrderData } from "../types";
import { ShowAndCopyIdComponent } from "./ShowAndCopyIDComponent";
import { UserComponent } from "./UserComponent";
import { AppStateContext } from "../AppLogic";


interface OrderComponentProps { 
    order: OrderData
};

export const OrderComponent : FunctionComponent<OrderComponentProps> = 
    ( { order } ) => {

    const { appState, pushActionIntoQueue : pushAction } = useContext(AppStateContext)
        

    const isServerActionInProgress = appState.systemStore.value.serverActionInProgress == true;

    useEffect( () => {
        if (order.orderDetails == null) {
            pushAction({ type:ACTION_FETCH_ORDER_DETAILS, payload:{ orderId : order.id } })
        }
    }, [order])

    const deleteOrder = () => {
        if (isServerActionInProgress) {
            console.log("Ignore deleteOrder - delete in Progress ...");
            return;
        }
        pushAction( { type : ACTION_DELETE_ORDERS_AND_FETCH, 
            payload : { orderIds : [ order.id ]  },
            finishFunction : () => (true) } )
    } 

    function formatDateTime(isoDateString: string): string {
        const date = new Date(isoDateString);
    
        const dateFormatter = new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    
        const timeFormatter = new Intl.DateTimeFormat('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    
        return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
    }
    

    return <div className="card order-card" style="position: relative;">
        <span className="date-time">{formatDateTime(order.order_datetime) }</span> 
        Status <span className="status">{order.order_status}</span>
        <span className="order-id">
        <ShowAndCopyIdComponent id={order.id} type="Order-Id" content="ID"/></span>
        <br/>
        {order.price == null ? 'Price unknown' : ("Price: " + order.price)  }
        <UserComponent
            id={order.user_id}
             />
        {order.address.first_name} {order.address.last_name}, {order.address.street} {order.address.house_number}, {order.address.post_code} {order.address.town} 
        <OrderDetailsComponent order={order} />
        <a style="position: absolute; bottom:10px; right: 10px; cursor:pointer;"
            onClick={() => deleteOrder()}>&#128465;</a>
    </div>
}