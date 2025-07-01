import uuid

from pydantic import BaseModel, ConfigDict


class ToppingBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    price: float
    description: str


class ToppingCreateSchema(ToppingBaseSchema):
    stock: int


class ToppingTestSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str


class ToppingSchema(ToppingCreateSchema):
    id: uuid.UUID


class ToppingListItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    price: float
    description: str
