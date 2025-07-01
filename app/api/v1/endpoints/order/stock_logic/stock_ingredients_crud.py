import logging
from sqlalchemy.orm import Session

from app.database.models import PizzaType


def ingredients_are_available(pizza_type: PizzaType):
    if pizza_type.dough.stock == 0:
        return False
    if pizza_type.sauce.stock == 0:
        return False

    for topping_quantity in pizza_type.toppings:
        if topping_quantity.topping.stock < topping_quantity.quantity:
            return False

    return True


def reduce_stock_of_ingredients(pizza_type: PizzaType, db: Session):
    pizza_type.dough.stock -= 1
    pizza_type.sauce.stock -= 1
    for topping_quantity in pizza_type.toppings:
        topping_quantity.topping.stock -= topping_quantity.quantity

    db.commit()
    logging.info('Ingredients Stock reduced')


def increase_stock_of_ingredients(pizza_type: PizzaType, db: Session):
    pizza_type.dough.stock += 1
    pizza_type.sauce.stock += 1
    for topping_quantity in pizza_type.toppings:
        topping_quantity.topping.stock += topping_quantity.quantity

    db.commit()
    logging.info('Ingredients Stock increased')
