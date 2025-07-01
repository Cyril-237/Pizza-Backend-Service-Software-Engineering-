import pytest
from decimal import Decimal

import app.api.v1.endpoints.dough.crud as dough_crud
from app.api.v1.endpoints.dough.schemas import DoughCreateSchema
from app.database.connection import SessionLocal


@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_dough_create_read_delete(db):
    # Arrange
    new_dough_name = 'Test Dough'
    new_dough_price = Decimal('5.99')
    new_dough_description = 'Test dough description'
    new_dough_stock = 10

    # Clean up if test data already exists (just in case)
    existing = dough_crud.get_dough_by_name(new_dough_name, db)
    if existing:
        dough_crud.delete_dough_by_id(existing.id, db)

    number_of_doughs_before = len(dough_crud.get_all_doughs(db))

    dough_schema = DoughCreateSchema(
        name=new_dough_name,
        price=new_dough_price,
        description=new_dough_description,
        stock=new_dough_stock,
    )

    # Act: Create
    created_dough = dough_crud.create_dough(dough_schema, db)
    assert created_dough is not None
    created_id = created_dough.id

    # Assert: Creation successful
    doughs = dough_crud.get_all_doughs(db)
    assert len(doughs) == number_of_doughs_before + 1

    # Act: Read
    read_dough = dough_crud.get_dough_by_id(created_id, db)

    # Assert: Read matches input
    assert read_dough is not None
    assert read_dough.id == created_id
    assert read_dough.name == new_dough_name
    assert read_dough.price == new_dough_price
    assert read_dough.description == new_dough_description
    assert read_dough.stock == new_dough_stock

    # Act: Delete
    dough_crud.delete_dough_by_id(created_id, db)

    # Assert: Back to original count
    final_count = len(dough_crud.get_all_doughs(db))
    assert final_count == number_of_doughs_before

    # Assert: Deleted dough no longer accessible
    deleted = dough_crud.get_dough_by_id(created_id, db)
    assert deleted is None
