import uuid

import pytest

from app.api.v1.endpoints.beverage.schemas import BeverageSchema, BeverageBaseSchema, BeverageCreateSchema


@pytest.fixture(scope='module')
def beverage_dict():
    return {
        'id': uuid.uuid4(),
        'name': 'Cola',
        'price': 2.99,
        'description': 'Viel Zucker',
        'stock': 109,
    }


def test_beverage_create_schema(beverage_dict):
    schema = BeverageCreateSchema(**beverage_dict)
    assert schema.name == beverage_dict['name']
    assert schema.price == beverage_dict['price']
    assert schema.description == beverage_dict['description']
    assert schema.stock == beverage_dict['stock']

    assert not hasattr(schema, 'id')


def test_beverage_base_schema(beverage_dict):
    schema = BeverageBaseSchema(**beverage_dict)
    assert schema.name == beverage_dict['name']
    assert schema.price == beverage_dict['price']
    assert schema.description == beverage_dict['description']

    assert not hasattr(schema, 'id')
    assert not hasattr(schema, 'stock')


def test_schema(beverage_dict):
    schema = BeverageSchema(**beverage_dict)
    assert schema.id == beverage_dict['id']
    assert schema.name == beverage_dict['name']
    assert schema.price == beverage_dict['price']
    assert schema.description == beverage_dict['description']
    assert schema.stock == beverage_dict['stock']
