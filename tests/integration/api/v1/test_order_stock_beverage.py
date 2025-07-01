import pytest

from app.database.connection import SessionLocal
from app.api.v1.endpoints.beverage import crud as beverage_crud
from app.api.v1.endpoints.order.stock_logic import stock_beverage_crud
from app.api.v1.endpoints.beverage.schemas import BeverageCreateSchema

INITIAL_STOCK = 5
STOCK_AFTER_FIRST_CHANGE = 3

@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_beverage_stock_logic(db):
    # Arrange
    beverage_name = 'Test Beverage'
    beverage_stock = INITIAL_STOCK
    beverage_price = float(2.50)
    beverage_description = 'A beverage used for testing'

    #Clean up any previous test artifacts
    existing = beverage_crud.get_beverage_by_name(beverage_name, db)
    if existing:
        beverage_crud.delete_beverage_by_id(existing.id, db)

    #Create test beverage
    beverage_schema = BeverageCreateSchema(
        name=beverage_name,
        stock=beverage_stock,
        price=beverage_price,
        description=beverage_description
    )
    created_beverage = beverage_crud.create_beverage(beverage_schema, db)
    assert created_beverage is not None
    beverage_id = created_beverage.id

    #Act & Assert: Check stock availability
    assert stock_beverage_crud.beverage_is_available(beverage_id, 3, db) is True
    assert stock_beverage_crud.beverage_is_available(beverage_id, 5, db) is True
    assert stock_beverage_crud.beverage_is_available(beverage_id, 6, db) is False

    #Act & Assert: Change stock
    assert stock_beverage_crud.change_stock_of_beverage(beverage_id, -2, db) is True
    updated = beverage_crud.get_beverage_by_id(beverage_id, db)
    assert updated.stock == STOCK_AFTER_FIRST_CHANGE

    assert stock_beverage_crud.change_stock_of_beverage(beverage_id, -4, db) is False
    assert stock_beverage_crud.change_stock_of_beverage(beverage_id, 2, db) is True
    updated = beverage_crud.get_beverage_by_id(beverage_id, db)
    assert updated.stock == INITIAL_STOCK

    #Clean up
    beverage_crud.delete_beverage_by_id(beverage_id, db)
    assert beverage_crud.get_beverage_by_id(beverage_id, db) is None
