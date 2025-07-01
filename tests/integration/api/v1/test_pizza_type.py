import pytest

from decimal import Decimal
from app.api.v1.endpoints.dough.schemas import DoughCreateSchema
from app.api.v1.endpoints.sauce.schemas import SauceCreateSchema, SauceType
from app.api.v1.endpoints.pizza_type.schemas import PizzaTypeCreateSchema
import app.api.v1.endpoints.dough.crud as dough_crud
import app.api.v1.endpoints.sauce.crud as sauce_crud
import app.api.v1.endpoints.pizza_type.crud as pizza_type_crud
from app.database.connection import SessionLocal


@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_pizza_type_create_read_delete(db):
    # Arrange: Create test dough+sauce (foreign key requirement)
    dough_name = 'Test Pizza Dough'
    dough = dough_crud.get_dough_by_name(dough_name, db)
    if not dough:
        dough_schema = DoughCreateSchema(
            name=dough_name,
            price=Decimal('3.99'),
            description='Temporary dough for pizza type test',
            stock=50,
        )
        dough = dough_crud.create_dough(dough_schema, db)
    sauce_name = 'Test Pizza Sauce'
    sauce = sauce_crud.get_sauce_by_name(sauce_name, db)
    if not sauce:
        sauce_schema = SauceCreateSchema(
            name=sauce_name,
            price=Decimal('3.99'),
            description='Temporary sauce for pizza type test',
            stock=50,
            type=SauceType.VERY_SPICY,
        )
        sauce = sauce_crud.create_sauce(sauce_schema, db)

    pizza_type_name = 'Test Pizza Type'
    # Clean up if test data already exists
    existing = pizza_type_crud.get_pizza_type_by_name(pizza_type_name, db)
    if existing:
        pizza_type_crud.delete_pizza_type_by_id(existing.id, db)

    num_before = len(pizza_type_crud.get_all_pizza_types(db))

    # Act: Create pizza type
    pizza_schema = PizzaTypeCreateSchema(
        name=pizza_type_name,
        price=9.99,
        description='Test pizza description',
        dough_id=dough.id,
        sauce_id=sauce.id,
    )
    created_pizza = pizza_type_crud.create_pizza_type(pizza_schema, db)
    assert created_pizza is not None
    created_id = created_pizza.id

    # Assert: Created
    all_after_create = pizza_type_crud.get_all_pizza_types(db)
    assert len(all_after_create) == num_before + 1

    # Act: Read
    read_pizza = pizza_type_crud.get_pizza_type_by_id(created_id, db)
    # Assert: Read matches input
    assert read_pizza is not None
    assert read_pizza.name == pizza_schema.name
    assert read_pizza.price == Decimal(str(pizza_schema.price))  # Fix type mismatch
    assert read_pizza.description == pizza_schema.description
    assert read_pizza.dough_id == dough.id
    assert read_pizza.sauce_id == sauce.id

    # Act: Delete
    pizza_type_crud.delete_pizza_type_by_id(created_id, db)

    # Assert: Deleted
    final_count = len(pizza_type_crud.get_all_pizza_types(db))
    assert final_count == num_before

    deleted = pizza_type_crud.get_pizza_type_by_id(created_id, db)
    assert deleted is None
