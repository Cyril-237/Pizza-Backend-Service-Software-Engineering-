import uuid
import enum

from datetime import datetime

import pytest
from app.api.v1.endpoints.order.schemas import OrderSchema, OrderBaseSchema, OrderCreateSchema, \
    OrderUpdateOrderStatusSchema
from app.api.v1.endpoints.order.schemas import PizzaBaseSchema, PizzaCreateSchema,\
    PizzaSchema, PizzaWithoutPizzaTypeSchema, JoinedPizzaPizzaTypeSchema,\
    OrderBeverageQuantityBaseSchema, OrderBeverageQuantityCreateSchema


# Enum for OrderStatus
class OrderStatus(str, enum.Enum):
    TRANSMITTED = 'TRANSMITTED'
    PREPARING = 'PREPARING'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'


@pytest.fixture(scope='module')
def order_dict(create_real_address):
    return {
        'id': uuid.uuid4(),
        'order_datetime': datetime.now(),
        'user_id': uuid.uuid4(),
        'address': create_real_address,
        'order_status': OrderStatus.TRANSMITTED,
    }


@pytest.fixture(scope='module')
def pizza_dict():
    return {
        'id': uuid.uuid4(),
        'pizza_type_id': uuid.uuid4(),
    }


@pytest.fixture(scope='module')
def joined_pizza_pizza_type_dict():
    return {
        'id': uuid.uuid4(),
        'pizza_type_id': uuid.uuid4(),
        'name': 'Salamipizza',
        'price': 6.99,
        'description': 'Mit extra viel Salami',
    }


@pytest.fixture(scope='module')
def order_beverage_quantity_dict():
    return {
        'quantity': 2,
        'beverage_id': uuid.uuid4(),
    }


def test_order_base_schema(order_dict):
    schema = OrderBaseSchema(**order_dict)
    assert not hasattr(schema, 'id')
    assert not hasattr(schema, 'order_datetime')
    assert not hasattr(schema, 'user_id')
    assert not hasattr(schema, 'order_status')


def test_create_schema(order_dict):
    schema = OrderCreateSchema(**order_dict)
    assert not hasattr(schema, 'order_datetime')
    assert not hasattr(schema, 'order_status')


def test_order_schema(order_dict):
    schema = OrderSchema(**order_dict)
    assert schema.id == order_dict['id']
    assert schema.order_datetime == order_dict['order_datetime']
    assert schema.user_id == order_dict['user_id']
    assert schema.order_status == order_dict['order_status']


def test_update_schema(order_dict):
    schema = OrderUpdateOrderStatusSchema(**order_dict)
    assert schema.order_status == order_dict['order_status']
    assert schema.id == order_dict['id']
    assert not hasattr(schema, 'user_id')
    assert not hasattr(schema, 'order_datetime')


def test_pizza_base_schema(pizza_dict):
    schema = PizzaBaseSchema(**pizza_dict)
    assert not hasattr(schema, 'id')
    assert not hasattr(schema, 'pizza_type_id')


def test_pizza_create_schema(pizza_dict):
    schema = PizzaCreateSchema(**pizza_dict)
    assert schema.pizza_type_id == pizza_dict['pizza_type_id']

    assert not hasattr(schema, 'id')


def test_pizza_schema(pizza_dict):
    schema = PizzaSchema(**pizza_dict)
    assert schema.id == pizza_dict['id']
    assert schema.pizza_type_id == pizza_dict['pizza_type_id']


def test_pizza_without_pizza_type_schema(pizza_dict):
    schema = PizzaWithoutPizzaTypeSchema(**pizza_dict)
    assert schema.id == pizza_dict['id']

    assert not hasattr(schema, 'pizza_type_id')


def test_joined_pizza_pizza_type_schema(joined_pizza_pizza_type_dict):
    schema = JoinedPizzaPizzaTypeSchema(**joined_pizza_pizza_type_dict)
    assert schema.id == joined_pizza_pizza_type_dict['id']
    assert schema.name == joined_pizza_pizza_type_dict['name']
    assert schema.price == joined_pizza_pizza_type_dict['price']
    assert schema.description == joined_pizza_pizza_type_dict['description']

    assert not hasattr(schema, 'pizza_type_id')


def test_order_beverage_quantity_base_schema(order_beverage_quantity_dict):
    schema = OrderBeverageQuantityBaseSchema(**order_beverage_quantity_dict)
    assert schema.quantity == order_beverage_quantity_dict['quantity']

    assert not hasattr(schema, 'beverage_id')


def test_order_beverage_quantity_create_schema(order_beverage_quantity_dict):
    schema = OrderBeverageQuantityCreateSchema(**order_beverage_quantity_dict)
    assert schema.quantity == order_beverage_quantity_dict['quantity']
    assert schema.beverage_id == order_beverage_quantity_dict['beverage_id']
