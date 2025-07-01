import uuid

from pydantic import BaseModel, ConfigDict


class AddressBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    street: str
    post_code: str
    house_number: int
    country: str
    town: str
    first_name: str
    last_name: str


class AddressCreateSchema(AddressBaseSchema):
    pass


class AddressSchema(AddressCreateSchema):
    id: uuid.UUID
