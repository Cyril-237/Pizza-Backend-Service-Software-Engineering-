/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DoughCreateSchema } from '../models/DoughCreateSchema';
import type { DoughListItemSchema } from '../models/DoughListItemSchema';
import type { DoughSchema } from '../models/DoughSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoughService {
    /**
     * Get All Doughs
     * @returns DoughListItemSchema Successful Response
     * @throws ApiError
     */
    public static getAllDoughsV1DoughsGet(): CancelablePromise<Array<DoughListItemSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/doughs',
        });
    }
    /**
     * Create Dough
     * @param requestBody
     * @returns DoughSchema Successful Response
     * @throws ApiError
     */
    public static createDoughV1DoughsPost(
        requestBody: DoughCreateSchema,
    ): CancelablePromise<DoughSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/doughs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Dough
     * @param doughId
     * @returns DoughSchema Successful Response
     * @throws ApiError
     */
    public static getDoughV1DoughsDoughIdGet(
        doughId: string,
    ): CancelablePromise<DoughSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/doughs/{dough_id}',
            path: {
                'dough_id': doughId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Dough
     * @param doughId
     * @param requestBody
     * @returns DoughSchema Successful Response
     * @throws ApiError
     */
    public static updateDoughV1DoughsDoughIdPut(
        doughId: string,
        requestBody: DoughCreateSchema,
    ): CancelablePromise<DoughSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/doughs/{dough_id}',
            path: {
                'dough_id': doughId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Dough
     * @param doughId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteDoughV1DoughsDoughIdDelete(
        doughId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/doughs/{dough_id}',
            path: {
                'dough_id': doughId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
