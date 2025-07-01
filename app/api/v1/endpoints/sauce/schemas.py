import uuid
from enum import Enum
from pydantic import BaseModel, ConfigDict


class SauceType(str, Enum):
    NOT_SPICY = 'NOT_SPICY'
    SPICY = 'SPICY'
    VERY_SPICY = 'VERY_SPICY'


class SauceBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    price: float
    description: str
    type: SauceType


class SauceCreateSchema(SauceBaseSchema):
    stock: int


class SauceSchema(SauceCreateSchema):
    id: uuid.UUID


class SauceListItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    price: float
    description: str
    type: SauceType
