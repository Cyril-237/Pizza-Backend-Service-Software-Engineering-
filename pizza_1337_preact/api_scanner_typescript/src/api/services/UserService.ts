/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserCreateSchema } from '../models/UserCreateSchema';
import type { UserSchema } from '../models/UserSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get All Users
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static getAllUsersV1UsersGet(): CancelablePromise<Array<UserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/users',
        });
    }
    /**
     * Create User
     * @param requestBody
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static createUserV1UsersPost(
        requestBody: UserCreateSchema,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User
     * @param userId
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static getUserV1UsersUserIdGet(
        userId: string,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param userId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateUserV1UsersUserIdPut(
        userId: string,
        requestBody: UserCreateSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteUserV1UsersUserIdDelete(
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
