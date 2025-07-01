import pytest
from decimal import Decimal

import app.api.v1.endpoints.sauce.crud as sauce_crud
from app.api.v1.endpoints.sauce.schemas import SauceCreateSchema, SauceType
from app.database.connection import SessionLocal


@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_sauce_create_read_delete(db):
    # Arrange
    new_sauce_name = 'Test Sauce'
    new_sauce_price = Decimal('5.99')
    new_sauce_description = 'Test sauce description'
    new_sauce_stock = 10
    new_sauce_type = SauceType.VERY_SPICY

    # Clean up if test data already exists (just in case)
    existing = sauce_crud.get_sauce_by_name(new_sauce_name, db)
    if existing:
        sauce_crud.delete_sauce_by_id(existing.id, db)

    number_of_sauces_before = len(sauce_crud.get_all_sauces(db))

    sauce_schema = SauceCreateSchema(
        name=new_sauce_name,
        price=new_sauce_price,
        description=new_sauce_description,
        stock=new_sauce_stock,
        type=new_sauce_type,
    )

    # Act: Create
    created_sauce = sauce_crud.create_sauce(sauce_schema, db)
    assert created_sauce is not None
    created_id = created_sauce.id

    # Assert: Creation successful
    sauces = sauce_crud.get_all_sauces(db)
    assert len(sauces) == number_of_sauces_before + 1

    # Act: Read
    read_sauce = sauce_crud.get_sauce_by_id(created_id, db)

    # Assert: Read matches input
    assert read_sauce is not None
    assert read_sauce.id == created_id
    assert read_sauce.name == new_sauce_name
    assert read_sauce.price == new_sauce_price
    assert read_sauce.description == new_sauce_description
    assert read_sauce.stock == new_sauce_stock
    assert read_sauce.type == new_sauce_type

    # Act: Delete
    sauce_crud.delete_sauce_by_id(created_id, db)

    # Assert: Back to original count
    final_count = len(sauce_crud.get_all_sauces(db))
    assert final_count == number_of_sauces_before

    # Assert: Deleted sauce no longer accessible
    deleted = sauce_crud.get_sauce_by_id(created_id, db)
    assert deleted is None
