import uuid

import pytest

from app.api.v1.endpoints.dough.schemas import DoughBaseSchema, DoughCreateSchema, DoughSchema


@pytest.fixture(scope='module')
def dough_dict():
    return {
        'id': uuid.uuid4(),
        'name': 'Whole Grain',
        'price': 1.50,
        'description': 'Test Dough',
        'stock': 1000,
    }


def test_dough_create_schema(dough_dict):
    schema = DoughCreateSchema(**dough_dict)
    assert schema.name == dough_dict['name']
    assert schema.price == dough_dict['price']
    assert schema.description == dough_dict['description']
    assert schema.stock == dough_dict['stock']

    assert not hasattr(schema, 'id')


def test_dough_base_schema(dough_dict):
    schema = DoughBaseSchema(**dough_dict)
    assert schema.name == dough_dict['name']
    assert schema.price == dough_dict['price']
    assert schema.description == dough_dict['description']

    assert not hasattr(schema, 'id')
    assert not hasattr(schema, 'stock')


def test_schema(dough_dict):
    schema = DoughSchema(**dough_dict)
    assert schema.id == dough_dict['id']
    assert schema.name == dough_dict['name']
    assert schema.price == dough_dict['price']
    assert schema.description == dough_dict['description']
    assert schema.stock == dough_dict['stock']
