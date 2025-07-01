import pytest
from decimal import Decimal

import app.api.v1.endpoints.topping.crud as topping_crud
from app.api.v1.endpoints.topping.schemas import ToppingCreateSchema
from app.database.connection import SessionLocal


@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_topping_create_read_delete(db):
    # Arrange
    new_topping_name = 'Test Topping'
    new_topping_price = Decimal('5.99')
    new_topping_description = 'Test topping description'
    new_topping_stock = 10

    # Clean up if test data already exists (just in case)
    existing = topping_crud.get_topping_by_name(new_topping_name, db)
    if existing:
        topping_crud.delete_topping_by_id(existing.id, db)

    number_of_toppings_before = len(topping_crud.get_all_toppings(db))

    topping_schema = ToppingCreateSchema(
        name=new_topping_name,
        price=new_topping_price,
        description=new_topping_description,
        stock=new_topping_stock,
    )

    # Act: Create
    created_topping = topping_crud.create_topping(topping_schema, db)
    assert created_topping is not None
    created_id = created_topping.id

    # Assert: Creation successful
    toppings = topping_crud.get_all_toppings(db)
    assert len(toppings) == number_of_toppings_before + 1

    # Act: Read
    read_topping = topping_crud.get_topping_by_id(created_id, db)

    # Assert: Read matches input
    assert read_topping is not None
    assert read_topping.id == created_id
    assert read_topping.name == new_topping_name
    assert read_topping.price == new_topping_price
    assert read_topping.description == new_topping_description
    assert read_topping.stock == new_topping_stock

    # Act: Delete
    topping_crud.delete_topping_by_id(created_id, db)

    # Assert: Back to original count
    final_count = len(topping_crud.get_all_toppings(db))
    assert final_count == number_of_toppings_before

    # Assert: Deleted topping no longer accessible
    deleted = topping_crud.get_topping_by_id(created_id, db)
    assert deleted is None
