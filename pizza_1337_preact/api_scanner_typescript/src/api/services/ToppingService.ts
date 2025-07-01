/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ToppingCreateSchema } from '../models/ToppingCreateSchema';
import type { ToppingListItemSchema } from '../models/ToppingListItemSchema';
import type { ToppingSchema } from '../models/ToppingSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ToppingService {
    /**
     * Get All Toppings
     * @returns ToppingListItemSchema Successful Response
     * @throws ApiError
     */
    public static getAllToppingsV1ToppingsGet(): CancelablePromise<Array<ToppingListItemSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/toppings',
        });
    }
    /**
     * Create Topping
     * @param requestBody
     * @returns ToppingSchema Successful Response
     * @throws ApiError
     */
    public static createToppingV1ToppingsPost(
        requestBody: ToppingCreateSchema,
    ): CancelablePromise<ToppingSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/toppings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Topping
     * @param toppingId
     * @returns ToppingSchema Successful Response
     * @throws ApiError
     */
    public static getToppingV1ToppingsToppingIdGet(
        toppingId: string,
    ): CancelablePromise<ToppingSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/toppings/{topping_id}',
            path: {
                'topping_id': toppingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Topping
     * @param toppingId
     * @param requestBody
     * @returns ToppingSchema Successful Response
     * @throws ApiError
     */
    public static updateToppingV1ToppingsToppingIdPut(
        toppingId: string,
        requestBody: ToppingCreateSchema,
    ): CancelablePromise<ToppingSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/toppings/{topping_id}',
            path: {
                'topping_id': toppingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Topping
     * @param toppingId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteToppingV1ToppingsToppingIdDelete(
        toppingId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/toppings/{topping_id}',
            path: {
                'topping_id': toppingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
