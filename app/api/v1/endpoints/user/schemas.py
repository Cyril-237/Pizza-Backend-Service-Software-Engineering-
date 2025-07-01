import uuid

from pydantic import BaseModel, ConfigDict


class UserBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str


class UserCreateSchema(UserBaseSchema):
    pass


class UserTestSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str


class UserSchema(UserBaseSchema):
    id: uuid.UUID
