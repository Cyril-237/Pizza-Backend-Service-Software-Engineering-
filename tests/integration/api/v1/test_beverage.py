import pytest
from decimal import Decimal

import app.api.v1.endpoints.beverage.crud as beverage_crud
from app.api.v1.endpoints.beverage.schemas import BeverageCreateSchema
from app.database.connection import SessionLocal


@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_beverage_create_read_delete(db):
    # Arrange
    new_beverage_name = 'Test Beverage'
    new_beverage_price = Decimal('5.99')
    new_beverage_description = 'Test beverage description'
    new_beverage_stock = 10

    # Clean up if test data already exists (just in case)
    existing = beverage_crud.get_beverage_by_name(new_beverage_name, db)
    if existing:
        beverage_crud.delete_beverage_by_id(existing.id, db)

    number_of_beverages_before = len(beverage_crud.get_all_beverages(db))

    beverage_schema = BeverageCreateSchema(
        name=new_beverage_name,
        price=new_beverage_price,
        description=new_beverage_description,
        stock=new_beverage_stock,
    )

    # Act: Create
    created_beverage = beverage_crud.create_beverage(beverage_schema, db)
    assert created_beverage is not None
    created_id = created_beverage.id

    # Assert: Creation successful
    beverages = beverage_crud.get_all_beverages(db)
    assert len(beverages) == number_of_beverages_before + 1

    # Act: Read
    read_beverage = beverage_crud.get_beverage_by_id(created_id, db)

    # Assert: Read matches input
    assert read_beverage is not None
    assert read_beverage.id == created_id
    assert read_beverage.name == new_beverage_name
    assert read_beverage.price == new_beverage_price
    assert read_beverage.description == new_beverage_description
    assert read_beverage.stock == new_beverage_stock

    # Act: Delete
    beverage_crud.delete_beverage_by_id(created_id, db)

    # Assert: Back to original count
    final_count = len(beverage_crud.get_all_beverages(db))
    assert final_count == number_of_beverages_before

    # Assert: Deleted beverage no longer accessible
    deleted = beverage_crud.get_beverage_by_id(created_id, db)
    assert deleted is None
