import uuid

from pydantic import BaseModel, ConfigDict

from app.api.v1.endpoints.topping.schemas import ToppingBaseSchema


class PizzaTypeBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    price: float
    description: str


class PizzaTypeCreateSchema(PizzaTypeBaseSchema):
    dough_id: uuid.UUID
    sauce_id: uuid.UUID


class PizzaTypeSchema(PizzaTypeBaseSchema):
    id: uuid.UUID


class PizzaTypeToppingQuantityBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    quantity: int


class PizzaTypeToppingQuantityCreateSchema(PizzaTypeToppingQuantityBaseSchema):
    topping_id: uuid.UUID


class JoinedPizzaTypeQuantitySchema(PizzaTypeBaseSchema, ToppingBaseSchema):
    pass
