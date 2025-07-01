import uuid

from pydantic import BaseModel, ConfigDict


class DoughBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    price: float
    description: str


class DoughCreateSchema(DoughBaseSchema):
    stock: int


class DoughSchema(DoughCreateSchema):
    id: uuid.UUID


class DoughListItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    price: float
    description: str
