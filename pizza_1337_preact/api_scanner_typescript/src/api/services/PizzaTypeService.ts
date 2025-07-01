/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DoughSchema } from '../models/DoughSchema';
import type { JoinedPizzaTypeQuantitySchema } from '../models/JoinedPizzaTypeQuantitySchema';
import type { PizzaTypeCreateSchema } from '../models/PizzaTypeCreateSchema';
import type { PizzaTypeSchema } from '../models/PizzaTypeSchema';
import type { PizzaTypeToppingQuantityCreateSchema } from '../models/PizzaTypeToppingQuantityCreateSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PizzaTypeService {
    /**
     * Get All Pizza Types
     * @returns PizzaTypeSchema Successful Response
     * @throws ApiError
     */
    public static getAllPizzaTypesV1PizzaTypesGet(): CancelablePromise<Array<PizzaTypeSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/pizza-types',
        });
    }
    /**
     * Create Pizza Type
     * @param requestBody
     * @returns PizzaTypeSchema Successful Response
     * @throws ApiError
     */
    public static createPizzaTypeV1PizzaTypesPost(
        requestBody: PizzaTypeCreateSchema,
    ): CancelablePromise<PizzaTypeSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/pizza-types',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pizza Type
     * @param pizzaTypeId
     * @returns PizzaTypeSchema Successful Response
     * @throws ApiError
     */
    public static getPizzaTypeV1PizzaTypesPizzaTypeIdGet(
        pizzaTypeId: string,
    ): CancelablePromise<PizzaTypeSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/pizza-types/{pizza_type_id}',
            path: {
                'pizza_type_id': pizzaTypeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Pizza Type
     * @param pizzaTypeId
     * @param requestBody
     * @returns PizzaTypeSchema Successful Response
     * @throws ApiError
     */
    public static updatePizzaTypeV1PizzaTypesPizzaTypeIdPut(
        pizzaTypeId: string,
        requestBody: PizzaTypeCreateSchema,
    ): CancelablePromise<PizzaTypeSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/pizza-types/{pizza_type_id}',
            path: {
                'pizza_type_id': pizzaTypeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Pizza Type
     * @param pizzaTypeId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePizzaTypeV1PizzaTypesPizzaTypeIdDelete(
        pizzaTypeId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/pizza-types/{pizza_type_id}',
            path: {
                'pizza_type_id': pizzaTypeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pizza Type Toppings
     * @param pizzaTypeId
     * @param join
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPizzaTypeToppingsV1PizzaTypesPizzaTypeIdToppingsGet(
        pizzaTypeId: string,
        join: boolean = false,
    ): CancelablePromise<(Array<PizzaTypeToppingQuantityCreateSchema> | Array<JoinedPizzaTypeQuantitySchema>)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/pizza-types/{pizza_type_id}/toppings',
            path: {
                'pizza_type_id': pizzaTypeId,
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
     * Create Pizza Type Topping
     * @param pizzaTypeId
     * @param requestBody
     * @returns PizzaTypeToppingQuantityCreateSchema Successful Response
     * @throws ApiError
     */
    public static createPizzaTypeToppingV1PizzaTypesPizzaTypeIdToppingsPost(
        pizzaTypeId: string,
        requestBody: PizzaTypeToppingQuantityCreateSchema,
    ): CancelablePromise<PizzaTypeToppingQuantityCreateSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/pizza-types/{pizza_type_id}/toppings',
            path: {
                'pizza_type_id': pizzaTypeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pizza Type Dough
     * @param pizzaTypeId
     * @returns DoughSchema Successful Response
     * @throws ApiError
     */
    public static getPizzaTypeDoughV1PizzaTypesPizzaTypeIdDoughGet(
        pizzaTypeId: string,
    ): CancelablePromise<DoughSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/pizza-types/{pizza_type_id}/dough',
            path: {
                'pizza_type_id': pizzaTypeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
