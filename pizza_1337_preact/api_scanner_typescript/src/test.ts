


// Call an endpoint
import {OrderService, OpenAPI } from "./api";

OpenAPI.BASE = 'http://localhost:8000';


let r = OrderService.getAllOrdersV1OrderGet();

r.then( v => {

    v.forEach( o => {
        console.log(o);
    })

})


