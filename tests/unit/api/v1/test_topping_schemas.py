import uuid

import pytest

from app.api.v1.endpoints.topping.schemas import ToppingSchema, ToppingBaseSchema, ToppingCreateSchema


@pytest.fixture(scope='module')
def topping_dict():
    return {
        'id': uuid.uuid4(),
        'name': 'Salami',
        'price': 1.50,
        'description': 'Italian quality',
        'stock': 3000,
    }


def test_topping_create_schema(topping_dict):
    schema = ToppingCreateSchema(**topping_dict)
    assert schema.name == topping_dict['name']
    assert schema.price == topping_dict['price']
    assert schema.description == topping_dict['description']
    assert schema.stock == topping_dict['stock']

    assert not hasattr(schema, 'id')


def test_topping_base_schema(topping_dict):
    schema = ToppingBaseSchema(**topping_dict)
    assert schema.name == topping_dict['name']
    assert schema.price == topping_dict['price']
    assert schema.description == topping_dict['description']

    assert not hasattr(schema, 'id')
    assert not hasattr(schema, 'stock')


def test_schema(topping_dict):
    schema = ToppingSchema(**topping_dict)
    assert schema.id == topping_dict['id']
    assert schema.name == topping_dict['name']
    assert schema.price == topping_dict['price']
    assert schema.description == topping_dict['description']
    assert schema.stock == topping_dict['stock']
