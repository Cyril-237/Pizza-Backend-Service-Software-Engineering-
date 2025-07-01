/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BeverageCreateSchema } from '../models/BeverageCreateSchema';
import type { BeverageListItemSchema } from '../models/BeverageListItemSchema';
import type { BeverageSchema } from '../models/BeverageSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BeverageService {
    /**
     * Get All Beverages
     * @returns BeverageListItemSchema Successful Response
     * @throws ApiError
     */
    public static getAllBeveragesV1BeveragesGet(): CancelablePromise<Array<BeverageListItemSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/beverages',
        });
    }
    /**
     * Create Beverage
     * @param requestBody
     * @returns BeverageSchema Successful Response
     * @throws ApiError
     */
    public static createBeverageV1BeveragesPost(
        requestBody: BeverageCreateSchema,
    ): CancelablePromise<BeverageSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/beverages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Beverage
     * @param beverageId
     * @returns BeverageSchema Successful Response
     * @throws ApiError
     */
    public static getBeverageV1BeveragesBeverageIdGet(
        beverageId: string,
    ): CancelablePromise<BeverageSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/beverages/{beverage_id}',
            path: {
                'beverage_id': beverageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Beverage
     * @param beverageId
     * @param requestBody
     * @returns BeverageSchema Successful Response
     * @throws ApiError
     */
    public static updateBeverageV1BeveragesBeverageIdPut(
        beverageId: string,
        requestBody: BeverageCreateSchema,
    ): CancelablePromise<BeverageSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/beverages/{beverage_id}',
            path: {
                'beverage_id': beverageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Beverage
     * @param beverageId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteBeverageV1BeveragesBeverageIdDelete(
        beverageId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/beverages/{beverage_id}',
            path: {
                'beverage_id': beverageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
