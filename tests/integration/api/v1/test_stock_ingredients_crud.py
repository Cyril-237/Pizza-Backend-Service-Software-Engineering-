# flake8: noqa: PLR2004
import uuid

import pytest
from sqlalchemy import select

from app.database.connection import SessionLocal
from app.database import models
from app.api.v1.endpoints.dough import crud as dough_crud
from app.api.v1.endpoints.sauce import crud as sauce_crud
from app.api.v1.endpoints.topping import crud as topping_crud
from app.api.v1.endpoints.pizza_type import crud as pizza_type_crud
from app.api.v1.endpoints.dough.schemas import DoughCreateSchema
from app.api.v1.endpoints.sauce.schemas import SauceCreateSchema, SauceType
from app.api.v1.endpoints.topping.schemas import ToppingCreateSchema
from app.api.v1.endpoints.pizza_type.schemas import PizzaTypeCreateSchema
from app.api.v1.endpoints.order.stock_logic import stock_ingredients_crud


@pytest.fixture(scope='function')
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

def _create_pizza_type(
    db,
    *,
    dough_stock: int,
    sauce_stock: int,
    topping_stock: int,
    topping_qty: int,
):
    dough = dough_crud.create_dough(
        DoughCreateSchema(
            name=f'IT-dough-{uuid.uuid4()}',
            description='integration-test',
            price=float('2.00'),
            stock=dough_stock,
        ),
        db,
    )

    sauce = sauce_crud.create_sauce(
        SauceCreateSchema(
            name=f'IT-sauce-{uuid.uuid4()}',
            description='integration-test',
            price=float('2.00'),
            stock=sauce_stock,
            type=SauceType.SPICY,
        ),
        db,
    )

    topping = topping_crud.create_topping(
        ToppingCreateSchema(
            name=f'IT-topping-{uuid.uuid4()}',
            description='integration-test',
            price=float('1.00'),
            stock=topping_stock,
        ),
        db,
    )

    pizza_type = pizza_type_crud.create_pizza_type(
        PizzaTypeCreateSchema(
            name=f'IT-pizza-{uuid.uuid4()}',
            description='integration-test',
            price=float('9.90'),
            dough_id=dough.id,
            sauce_id=sauce.id,
        ),
        db,
    )

    pt_tq = models.PizzaTypeToppingQuantity(
        pizza_type_id=pizza_type.id,
        topping_id=topping.id,
        quantity=topping_qty,
    )
    db.add(pt_tq)
    db.commit()
    db.refresh(pizza_type)
    db.refresh(dough)
    db.refresh(sauce)
    db.refresh(topping)

    return pizza_type, dough, sauce, topping

def test_ingredients_are_available_true(db):
    pizza_type, *_ = _create_pizza_type(
        db, dough_stock=1, sauce_stock=1, topping_stock=3, topping_qty=2
    )
    assert stock_ingredients_crud.ingredients_are_available(pizza_type) is True

def test_ingredients_are_available_false_no_dough(db):
    pizza_type, *_ = _create_pizza_type(
        db, dough_stock=0, sauce_stock=0, topping_stock=5, topping_qty=1
    )
    assert stock_ingredients_crud.ingredients_are_available(pizza_type) is False

def test_ingredients_are_available_false_topping_shortage(db):
    pizza_type, *_ = _create_pizza_type(
        db, dough_stock=1, sauce_stock=1, topping_stock=1, topping_qty=2
    )
    assert stock_ingredients_crud.ingredients_are_available(pizza_type) is False

def test_reduce_stock_of_ingredients_commits_and_logs(db, caplog):
    pizza_type, dough, sauce, topping = _create_pizza_type(
        db, dough_stock=4, sauce_stock=4, topping_stock=7, topping_qty=3
    )

    with caplog.at_level('INFO'):
        stock_ingredients_crud.reduce_stock_of_ingredients(pizza_type, db)

    dough_stock = db.scalar(select(models.Dough.stock).where(models.Dough.id == dough.id))
    sauce_stock = db.scalar(select(models.Sauce.stock).where(models.Sauce.id == sauce.id))
    topping_stock = db.scalar(select(models.Topping.stock).where(models.Topping.id == topping.id))

    assert dough_stock == 3
    assert sauce_stock == 3
    assert topping_stock == 4

def test_increase_stock_of_ingredients_commits_and_logs(db, caplog):
    pizza_type, dough, sauce, topping = _create_pizza_type(
        db, dough_stock=1, sauce_stock=1, topping_stock=2, topping_qty=2
    )

    with caplog.at_level('INFO'):
        stock_ingredients_crud.increase_stock_of_ingredients(pizza_type, db)

    dough_stock = db.scalar(select(models.Dough.stock).where(models.Dough.id == dough.id))
    sauce_stock = db.scalar(select(models.Sauce.stock).where(models.Sauce.id == sauce.id))
    topping_stock = db.scalar(select(models.Topping.stock).where(models.Topping.id == topping.id))

    assert dough_stock == 2
    assert sauce_stock == 2
    assert topping_stock == 4
