import uuid

import pytest

from app.api.v1.endpoints.sauce.schemas import SauceBaseSchema, SauceCreateSchema, SauceSchema, SauceType


@pytest.fixture(scope='module')
def sauce_dict():
    return {
        'id': uuid.uuid4(),
        'name': 'Tomato',
        'price': 0.50,
        'description': 'Test Sauce',
        'stock': 1000,
        'type': SauceType.SPICY
    }


def test_sauce_create_schema(sauce_dict):
    schema = SauceCreateSchema(**sauce_dict)
    assert schema.name == sauce_dict['name']
    assert schema.price == sauce_dict['price']
    assert schema.description == sauce_dict['description']
    assert schema.stock == sauce_dict['stock']
    assert schema.type == sauce_dict['type']

    assert not hasattr(schema, 'id')


def test_sauce_base_schema(sauce_dict):
    schema = SauceBaseSchema(**sauce_dict)
    assert schema.name == sauce_dict['name']
    assert schema.price == sauce_dict['price']
    assert schema.description == sauce_dict['description']

    assert not hasattr(schema, 'id')
    assert not hasattr(schema, 'stock')


def test_schema(sauce_dict):
    schema = SauceSchema(**sauce_dict)
    assert schema.id == sauce_dict['id']
    assert schema.name == sauce_dict['name']
    assert schema.price == sauce_dict['price']
    assert schema.description == sauce_dict['description']
    assert schema.stock == sauce_dict['stock']
    assert schema.type == sauce_dict['type']
