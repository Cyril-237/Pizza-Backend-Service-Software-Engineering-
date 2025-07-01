import datetime
import decimal
import enum
import uuid
from typing import List

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, DateTime, String
from sqlalchemy.orm import relationship, mapped_column, Mapped, DeclarativeBase
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


# Enum for OrderStatus
class OrderStatus(str, enum.Enum):
    TRANSMITTED = 'TRANSMITTED'
    PREPARING = 'PREPARING'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'


# Enum for SauceType
class SauceType(str, enum.Enum):
    NOT_SPICY = 'NOT_SPICY'
    SPICY = 'SPICY'
    VERY_SPICY = 'VERY_SPICY'


# models
class PizzaType(Base):
    __tablename__ = 'pizza_type'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    price: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str] = mapped_column(String(40), nullable=False, default='')

    dough_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('dough.id'), nullable=False)
    dough: Mapped['Dough'] = relationship()
    sauce_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('sauce.id'), nullable=False)
    sauce: Mapped['Sauce'] = relationship()
    toppings: Mapped[List['PizzaTypeToppingQuantity']] = relationship(cascade='all, delete-orphan',  # NOSONAR
                                                                      back_populates='pizza_type')
    type: Mapped[str] = mapped_column(nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'PizzaType',
        'polymorphic_on': type,
    }

    def __repr__(self):
        return "PizzaType(id='%s', name='%s', price='%s', description='%s', type='%s')" \
            % (self.id, self.name, self.price, self.description, self.type)


class PizzaTypeToppingQuantity(Base):
    __tablename__ = 'pizza_type_topping_quantity'

    pizza_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('pizza_type.id'), primary_key=True)
    pizza_type: Mapped['PizzaType'] = relationship(back_populates='toppings')
    topping_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('topping.id'), primary_key=True)
    quantity: Mapped[uuid.UUID] = mapped_column(Integer, CheckConstraint('quantity > 0'), nullable=False)
    topping: Mapped['Topping'] = relationship()

    def __repr__(self):
        return "PizzaTypeToppingQuantity(pizza_type_id='%s', topping_id='%s', quantity='%s')" \
            % (self.pizza_type_id, self.topping_id, self.quantity)


class Topping(Base):
    __tablename__ = 'topping'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    price: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str] = mapped_column(nullable=False, default='')
    stock: Mapped[int] = mapped_column(CheckConstraint('stock >= 0'), nullable=False)  # NOSONAR

    def __repr__(self):
        return "Topping(id='%s', name='%s', price='%s', description='%s', stock='%s')" \
            % (self.id, self.name, self.price, self.description, self.stock)


class Dough(Base):
    __tablename__ = 'dough'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    price: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str] = mapped_column(nullable=False, default='')
    stock: Mapped[int] = mapped_column(CheckConstraint('stock >= 0'), nullable=False)  # NOSONAR

    def __repr__(self):
        return "Dough(id='%s', name='%s', price='%s', description='%s', stock='%s')" \
            % (self.id, self.name, self.price, self.description, self.stock)


class Sauce(Base):
    __tablename__ = 'sauce'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    price: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str] = mapped_column(nullable=False, default='')
    stock: Mapped[int] = mapped_column(CheckConstraint('stock >= 0'), nullable=False)  # NOSONAR
    type: Mapped[SauceType] = mapped_column(default=SauceType.NOT_SPICY, nullable=False)

    def __repr__(self):
        return "Sauce(id='%s', name='%s', price='%s', description='%s', stock='%s', type='%s')" \
            % (self.id, self.name, self.price, self.description, self.stock, self.type)


class User(Base):
    __tablename__ = 'user'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(unique=False, nullable=False)
    customer_orders: Mapped[List['Order']] = relationship(cascade='all, delete-orphan',
                                                          back_populates='user')  # NOSONAR

    def __repr__(self):
        return "User(id='%s', username='%s') " \
            % (self.id, self.username)


class Order(Base):
    __tablename__ = 'customer_order'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    order_datetime: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=func.now(),
                                                              nullable=True)
    beverages: Mapped[List['OrderBeverageQuantity']] = relationship(cascade='all, delete-orphan',  # NOSONAR
                                                                    backref='customer_order')
    address_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('address.id'), unique=True, nullable=False)
    address: Mapped['Address'] = relationship(cascade='all, delete', back_populates='customer_order')
    pizzas: Mapped[List['Pizza']] = relationship(cascade='all, delete-orphan')  # NOSONAR
    user: Mapped['User'] = relationship(back_populates='customer_orders')
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('user.id'), nullable=False)
    order_status: Mapped[OrderStatus] = mapped_column(default=OrderStatus.TRANSMITTED, nullable=False)

    def __repr__(self):
        return "Order(id='%s', order_datetime='%s' beverages='%s', pizzas='%s', user='%s', \
        order_status='%s')" \
            % (self.id, self.order_datetime, self.beverages, self.pizzas, self.user, self.order_status)


class Pizza(Base):
    __tablename__ = 'pizza'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    pizza_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('pizza_type.id'), nullable=False)
    pizza_type: Mapped['PizzaType'] = relationship()
    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('customer_order.id'), nullable=True)

    def __repr__(self):
        return "Pizza(id='%s', pizza_type_id='%s', order_id='%s')" \
            % (self.id, self.pizza_type_id, self.order_id)


class Beverage(Base):
    __tablename__ = 'beverage'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    price: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str] = mapped_column(nullable=False, default='')
    stock: Mapped[int] = mapped_column(CheckConstraint('stock >= 0'), nullable=False)  # NOSONAR

    def __repr__(self):
        return "Beverage(id='%s', name='%s', price='%s', description='%s', stock='%s')" \
            % (self.id, self.name, self.price, self.description, self.stock)


class OrderBeverageQuantity(Base):
    __tablename__ = 'order_beverage_quantity'

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('customer_order.id'), primary_key=True)
    beverage_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('beverage.id'), primary_key=True)
    beverage: Mapped['Beverage'] = relationship()
    quantity: Mapped[int] = mapped_column(CheckConstraint('quantity > 0'), nullable=False)

    def __repr__(self):
        return "OrderBeverageQuantity(order_id='%s', beverage_id='%s', quantity='%s')" \
            % (self.order_id, self.beverage_id, self.quantity)


class Address(Base):
    __tablename__ = 'address'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    post_code: Mapped[str] = mapped_column(nullable=False)
    street: Mapped[str] = mapped_column(nullable=False)
    country: Mapped[str] = mapped_column(nullable=False)
    house_number: Mapped[int] = mapped_column(nullable=False)
    town: Mapped[str] = mapped_column(nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=False)
    customer_order: Mapped[List['Order']] = relationship(uselist=False, back_populates='address')

    def __repr__(self):
        return "Address(address_id='%s', post_code='%s', street='%s'," \
               " country='%s', house_number='%s', town='%s'," \
               " first_name='%s', last_name='%s')" \
            % (self.id, self.post_code, self.street, self.country, self.house_number,
               self.town, self.first_name, self.last_name)
