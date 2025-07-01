import uuid

from pydantic import BaseModel, ConfigDict


class BeverageBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    price: float
    description: str


class BeverageCreateSchema(BeverageBaseSchema):
    stock: int


class BeverageTestSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str


class BeverageSchema(BeverageCreateSchema):
    id: uuid.UUID


class BeverageListItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    price: float
    description: str
