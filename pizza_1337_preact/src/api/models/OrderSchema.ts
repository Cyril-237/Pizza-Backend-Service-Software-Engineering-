/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressSchema } from './AddressSchema';
import type { OrderStatus } from './OrderStatus';
export type OrderSchema = {
    address: AddressSchema;
    user_id: string;
    order_status: OrderStatus;
    id: string;
    order_datetime: string;
};

