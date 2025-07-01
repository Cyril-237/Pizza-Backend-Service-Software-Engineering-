import uuid

import pytest

from app.api.v1.endpoints.user.schemas import UserSchema, UserBaseSchema, UserCreateSchema


@pytest.fixture(scope='module')
def user_dict():
    return {
        'id': uuid.uuid4(),
        'username': 'stjaklar',
        'password': 's4v3Passw0rd',
    }


def test_user_create_schema(user_dict):
    schema = UserCreateSchema(**user_dict)
    assert schema.username == user_dict['username']

    assert not hasattr(schema, 'id')


def test_user_base_schema(user_dict):
    schema = UserBaseSchema(**user_dict)
    assert schema.username == user_dict['username']

    assert not hasattr(schema, 'id')


def test_schema(user_dict):
    schema = UserSchema(**user_dict)
    assert schema.username == user_dict['username']
