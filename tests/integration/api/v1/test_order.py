import uuid
from decimal import Decimal
import pytest
import app.api.v1.endpoints.dough.crud as dough_crud
import app.api.v1.endpoints.sauce.crud as sauce_crud
import app.api.v1.endpoints.pizza_type.crud as pizza_type_crud
import app.api.v1.endpoints.order.crud as order_crud
from app.api.v1.endpoints.dough.schemas import DoughCreateSchema
from app.api.v1.endpoints.sauce.schemas import SauceCreateSchema, SauceType
from app.api.v1.endpoints.pizza_type.schemas import PizzaTypeCreateSchema
from app.api.v1.endpoints.order.schemas import OrderCreateSchema, AddressCreateSchema
from app.database.connection import SessionLocal
from app.database.models import OrderStatus, User, Pizza

@pytest.fixture(scope='module')
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ruff: noqa: PLR0915, C901
def test_order_create_read_update_delete(db):  # NOSONAR
    # Create test user
    test_user = User(
        id=uuid.uuid4(),
        username='testuser'
    )
    db.add(test_user)
    db.commit()

    # Create test dough
    dough_schema = DoughCreateSchema(
        name='Test Dough Order',
        price=Decimal('4.50'),
        description='Temporary dough for order test',
        stock=100,
    )
    dough = dough_crud.get_dough_by_name(dough_schema.name, db)
    if dough:
        pizza_types = pizza_type_crud.get_all_pizza_types(db)
        for pt in pizza_types:
            if pt.dough_id == dough.id:
                pizzas = db.query(Pizza).filter(Pizza.pizza_type_id == pt.id).all()
                for pizza in pizzas:
                    db.delete(pizza)
                db.commit()
                pizza_type_crud.delete_pizza_type_by_id(pt.id, db)
        dough_crud.delete_dough_by_id(dough.id, db)
    dough = dough_crud.create_dough(dough_schema, db)

    # Create test sauce
    sauce_schema = SauceCreateSchema(
        name='Test Sauce Order',
        price=Decimal('4.50'),
        description='Temporary sauce for order test',
        stock=100,
        type=SauceType.VERY_SPICY,
    )
    sauce = sauce_crud.get_sauce_by_name(sauce_schema.name, db)
    if sauce:
        pizza_types = pizza_type_crud.get_all_pizza_types(db)
        for pt in pizza_types:
            if pt.sauce_id == sauce.id:
                pizzas = db.query(Pizza).filter(Pizza.pizza_type_id == pt.id).all()
                for pizza in pizzas:
                    db.delete(pizza)
                db.commit()
                pizza_type_crud.delete_pizza_type_by_id(pt.id, db)
        sauce_crud.delete_sauce_by_id(sauce.id, db)
    sauce = sauce_crud.create_sauce(sauce_schema, db)

    # Create pizza type
    pizza_type_schema = PizzaTypeCreateSchema(
        name='Test Pizza Type Order',
        price=Decimal('9.99'),
        description='Temporary pizza type',
        dough_id=dough.id,
        sauce_id=sauce.id,
    )
    pizza_type = pizza_type_crud.get_pizza_type_by_name(pizza_type_schema.name, db)
    if pizza_type:
        pizzas = db.query(Pizza).filter(Pizza.pizza_type_id == pizza_type.id).all()
        for pizza in pizzas:
            db.delete(pizza)
        db.commit()
        pizza_type_crud.delete_pizza_type_by_id(pizza_type.id, db)
    pizza_type = pizza_type_crud.create_pizza_type(pizza_type_schema, db)

    # Create address
    address_schema = AddressCreateSchema(
        post_code='12345',
        house_number=1,
        street='Teststraße',
        city='Teststadt',
        town='Testdorf',
        country='Testland',
        first_name='Max',
        last_name='Mustermann'
    )

    # Create order
    order_schema = OrderCreateSchema(
        address=address_schema,
        user_id=test_user.id,
    )
    created_order = order_crud.create_order(order_schema, db)
    assert created_order is not None
    order_id = created_order.id

    # Read order
    fetched_order = order_crud.get_order_by_id(order_id, db)
    assert fetched_order is not None
    assert fetched_order.order_status == OrderStatus.TRANSMITTED

    # Add pizza to order
    pizza = order_crud.add_pizza_to_order(fetched_order, pizza_type, db)
    assert pizza.pizza_type_id == pizza_type.id

    # Calculate total order price
    price = order_crud.get_price_of_order(order_id, db)
    assert price == Decimal(str(pizza_type_schema.price))

    # Test order status updates
    # Test updating to PREPARING
    updated_order = order_crud.update_order_status(fetched_order, OrderStatus.PREPARING, db)
    assert updated_order is not None
    assert updated_order.order_status == OrderStatus.PREPARING

    # Test updating to IN_DELIVERY
    updated_order = order_crud.update_order_status(fetched_order, OrderStatus.IN_DELIVERY, db)
    assert updated_order.order_status == OrderStatus.IN_DELIVERY

    # Test updating to COMPLETED
    updated_order = order_crud.update_order_status(fetched_order, OrderStatus.COMPLETED, db)
    assert updated_order.order_status == OrderStatus.COMPLETED

    # Test update_order_status_by_id function
    updated_order = order_crud.update_order_status_by_id(order_id, OrderStatus.TRANSMITTED, db)
    assert updated_order is not None
    assert updated_order.order_status == OrderStatus.TRANSMITTED

    # Test update_order_status_by_id with non-existent order
    fake_id = uuid.uuid4()
    result = order_crud.update_order_status_by_id(fake_id, OrderStatus.PREPARING, db)
    assert result is None

    # Cleanup - delete order and test data
    order_crud.delete_order_by_id(order_id, db)
    deleted_order = order_crud.get_order_by_id(order_id, db)
    assert deleted_order is None

    # Cleanup pizza type and dough and sauce
    pizza_type_crud.delete_pizza_type_by_id(pizza_type.id, db)
    dough_crud.delete_dough_by_id(dough.id, db)
    sauce_crud.delete_sauce_by_id(sauce.id, db)
    db.delete(test_user)
    db.commit()