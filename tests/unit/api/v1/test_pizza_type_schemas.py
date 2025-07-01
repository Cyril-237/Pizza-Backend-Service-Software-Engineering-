import uuid

import pytest

from app.api.v1.endpoints.pizza_type.schemas import PizzaTypeCreateSchema, PizzaTypeSchema, PizzaTypeBaseSchema, \
    PizzaTypeToppingQuantityBaseSchema, PizzaTypeToppingQuantityCreateSchema


@pytest.fixture(scope='module')
def pizza_type_dict():
    return {
        'id': uuid.uuid4(),
        'name': 'Salami',
        'price': 5,
        'description': 'Italian quality',
        'dough_id': uuid.uuid4(),
        'sauce_id': uuid.uuid4(),
    }


@pytest.fixture(scope='module')
def pizza_type_topping_quantity_dict():
    return {
        'quantity': 4,
        'topping_id': uuid.uuid4(),
    }


def test_pizza_type_base_schema(pizza_type_dict):
    schema = PizzaTypeBaseSchema(**pizza_type_dict)
    assert schema.name == pizza_type_dict['name']
    assert schema.price == pizza_type_dict['price']
    assert schema.description == pizza_type_dict['description']

    assert not hasattr(schema, 'id')


def test_pizza_type_create_schema(pizza_type_dict):
    schema = PizzaTypeCreateSchema(**pizza_type_dict)
    assert schema.name == pizza_type_dict['name']
    assert schema.price == pizza_type_dict['price']
    assert schema.description == pizza_type_dict['description']
    assert schema.dough_id == pizza_type_dict['dough_id']
    assert schema.sauce_id == pizza_type_dict['sauce_id']

    assert not hasattr(schema, 'id')


def test_pizza_type_schema(pizza_type_dict):
    schema = PizzaTypeSchema(**pizza_type_dict)
    assert schema.name == pizza_type_dict['name']
    assert schema.price == pizza_type_dict['price']
    assert schema.description == pizza_type_dict['description']
    assert schema.id == pizza_type_dict['id']


def test_pizza_type_topping_quantity_base_schema(pizza_type_topping_quantity_dict):
    schema = PizzaTypeToppingQuantityBaseSchema(**pizza_type_topping_quantity_dict)
    assert schema.quantity == pizza_type_topping_quantity_dict['quantity']

    assert not hasattr(schema, 'topping_id')


def test_pizza_type_topping_quantity_create_schema(pizza_type_topping_quantity_dict):
    schema = PizzaTypeToppingQuantityCreateSchema(**pizza_type_topping_quantity_dict)
    assert schema.quantity == pizza_type_topping_quantity_dict['quantity']
    assert schema.topping_id == pizza_type_topping_quantity_dict['topping_id']
