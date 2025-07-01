/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JoinedOrderBeverageQuantitySchema } from '../models/JoinedOrderBeverageQuantitySchema';
import type { JoinedPizzaPizzaTypeSchema } from '../models/JoinedPizzaPizzaTypeSchema';
import type { OrderBeverageQuantityBaseSchema } from '../models/OrderBeverageQuantityBaseSchema';
import type { OrderBeverageQuantityCreateSchema } from '../models/OrderBeverageQuantityCreateSchema';
import type { OrderCreateSchema } from '../models/OrderCreateSchema';
import type { OrderPriceSchema } from '../models/OrderPriceSchema';
import type { OrderSchema } from '../models/OrderSchema';
import type { PizzaCreateSchema } from '../models/PizzaCreateSchema';
import type { PizzaWithoutPizzaTypeSchema } from '../models/PizzaWithoutPizzaTypeSchema';
import type { UserSchema } from '../models/UserSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderService {
    /**
     * Get All Orders
     * @returns OrderSchema Successful Response
     * @throws ApiError
     */
    public static getAllOrdersV1OrderGet(): CancelablePromise<Array<OrderSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order',
        });
    }
    /**
     * Create Order
     * @param requestBody
     * @param copyOrderId
     * @returns OrderSchema Successful Response
     * @throws ApiError
     */
    public static createOrderV1OrderPost(
        requestBody: OrderCreateSchema,
        copyOrderId?: string,
    ): CancelablePromise<OrderSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order',
            query: {
                'copy_order_id': copyOrderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Order
     * @param orderId
     * @returns OrderSchema Successful Response
     * @throws ApiError
     */
    public static getOrderV1OrderOrderIdGet(
        orderId: string,
    ): CancelablePromise<OrderSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Order
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteOrderV1OrderOrderIdDelete(
        orderId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pizzas From Order
     * @param orderId
     * @returns JoinedPizzaPizzaTypeSchema Successful Response
     * @throws ApiError
     */
    public static getPizzasFromOrderV1OrderOrderIdPizzasGet(
        orderId: string,
    ): CancelablePromise<Array<JoinedPizzaPizzaTypeSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order/{order_id}/pizzas',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Pizza To Order
     * @param orderId
     * @param requestBody
     * @returns PizzaWithoutPizzaTypeSchema Successful Response
     * @throws ApiError
     */
    public static addPizzaToOrderV1OrderOrderIdPizzasPost(
        orderId: string,
        requestBody: PizzaCreateSchema,
    ): CancelablePromise<PizzaWithoutPizzaTypeSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order/{order_id}/pizzas',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Pizza From Order
     * @param orderId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePizzaFromOrderV1OrderOrderIdPizzasDelete(
        orderId: string,
        requestBody: PizzaWithoutPizzaTypeSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order/{order_id}/pizzas',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Order Beverages
     * @param orderId
     * @param join
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getOrderBeveragesV1OrderOrderIdBeveragesGet(
        orderId: string,
        join: boolean = false,
    ): CancelablePromise<(Array<OrderBeverageQuantityCreateSchema> | Array<JoinedOrderBeverageQuantitySchema>)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order/{order_id}/beverages',
            path: {
                'order_id': orderId,
            },
            query: {
                'join': join,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Beverage Of Order
     * @param orderId
     * @param requestBody
     * @returns OrderBeverageQuantityBaseSchema Successful Response
     * @throws ApiError
     */
    public static updateBeverageOfOrderV1OrderOrderIdBeveragesPut(
        orderId: string,
        requestBody: OrderBeverageQuantityCreateSchema,
    ): CancelablePromise<OrderBeverageQuantityBaseSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order/{order_id}/beverages',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Order Beverage
     * @param orderId
     * @param requestBody
     * @returns OrderBeverageQuantityCreateSchema Successful Response
     * @throws ApiError
     */
    public static createOrderBeverageV1OrderOrderIdBeveragesPost(
        orderId: string,
        requestBody: OrderBeverageQuantityCreateSchema,
    ): CancelablePromise<OrderBeverageQuantityCreateSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order/{order_id}/beverages',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Beverage From Order
     * @param orderId
     * @param beverageId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteBeverageFromOrderV1OrderOrderIdBeveragesDelete(
        orderId: string,
        beverageId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order/{order_id}/beverages',
            path: {
                'order_id': orderId,
            },
            query: {
                'beverage_id': beverageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Price Of Order
     * @param orderId
     * @returns OrderPriceSchema Successful Response
     * @throws ApiError
     */
    public static getPriceOfOrderV1OrderOrderIdPriceGet(
        orderId: string,
    ): CancelablePromise<OrderPriceSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order/{order_id}/price',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Of Order
     * @param orderId
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static getUserOfOrderV1OrderOrderIdUserGet(
        orderId: string,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order/{order_id}/user',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
