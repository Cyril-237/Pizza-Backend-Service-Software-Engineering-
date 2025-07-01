import datetime
import uuid
from pydantic import validator
from enum import Enum

from pydantic import BaseModel, ConfigDict

from app.api.v1.endpoints.beverage.schemas import BeverageBaseSchema
from app.api.v1.endpoints.order.address.schemas import AddressCreateSchema, AddressSchema
from app.api.v1.endpoints.pizza_type.schemas import PizzaTypeBaseSchema


class OrderStatus(str, Enum):
    TRANSMITTED = 'TRANSMITTED'
    PREPARING = 'PREPARING'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'


class OrderStatusUpdateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    status: OrderStatus

    @validator('status', pre=True)
    def status_case_insensitive(cls, v):
        if isinstance(v, str):
            return v.upper()
        return v


class OrderBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class OrderCreateSchema(OrderBaseSchema):
    address: AddressCreateSchema
    user_id: uuid.UUID


class OrderSchema(OrderCreateSchema):
    order_status: OrderStatus
    id: uuid.UUID
    order_datetime: datetime.datetime
    address: AddressSchema


class OrderPriceSchema(OrderBaseSchema):
    price: float


class PizzaBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PizzaCreateSchema(PizzaBaseSchema):
    pizza_type_id: uuid.UUID


class PizzaSchema(PizzaCreateSchema):
    id: uuid.UUID


class PizzaWithoutPizzaTypeSchema(PizzaBaseSchema):
    id: uuid.UUID


class JoinedPizzaPizzaTypeSchema(PizzaWithoutPizzaTypeSchema, PizzaTypeBaseSchema):
    pass


class JoinedPizzaSpecialWishPizzaSchema(PizzaWithoutPizzaTypeSchema):
    pass


class OrderBeverageQuantityBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    quantity: int


class OrderBeverageQuantityCreateSchema(OrderBeverageQuantityBaseSchema):
    beverage_id: uuid.UUID


class JoinedOrderBeverageQuantitySchema(OrderBaseSchema, BeverageBaseSchema):
    pass


class OrderUpdateOrderStatusSchema(OrderBaseSchema):
    id: uuid.UUID
    order_status: OrderStatus
