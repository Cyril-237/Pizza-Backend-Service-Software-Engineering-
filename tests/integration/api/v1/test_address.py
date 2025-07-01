# tests/integration/api/v1/test_address.py
import uuid

import pytest
from app.api.v1.endpoints.order.address import crud as address_crud
from app.api.v1.endpoints.order.address.schemas import AddressCreateSchema
from app.database.connection import SessionLocal


@pytest.fixture(scope='function')
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


def test_address_create_read_delete(db):
    """CRUD Cycle: create → read → delete"""
    unique = uuid.uuid4().hex[:8]
    initial_count = len(address_crud.get_all_addresses(db))

    # CREATE
    schema = AddressCreateSchema(
        street=f'PyTest-{unique} Street',
        post_code='75000',
        house_number=42,
        country='FR',
        town='Paris',
        first_name='Ada',
        last_name='Lovelace',
    )
    created = address_crud.create_address(schema, db)
    assert len(address_crud.get_all_addresses(db)) == initial_count + 1

    # READ
    fetched = address_crud.get_address_by_id(created.id, db)
    assert fetched is not None
    assert fetched.street == schema.street

    # DELETE
    address_crud.delete_address_by_id(created.id, db)
    assert len(address_crud.get_all_addresses(db)) == initial_count
    assert address_crud.get_address_by_id(created.id, db) is None
