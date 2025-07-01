import logging
import uuid

from sqlalchemy.orm import Session

from app.api.v1.endpoints.pizza_type.schemas import \
    PizzaTypeCreateSchema, \
    PizzaTypeToppingQuantityCreateSchema
from app.database.models import PizzaType, PizzaTypeToppingQuantity


def create_pizza_type(schema: PizzaTypeCreateSchema, db: Session):
    entity = PizzaType(**schema.dict())
    db.add(entity)
    db.commit()
    logging.info('PizzaType created {} with name {}'.format(entity.id, entity.name))
    return entity


def get_pizza_type_by_id(pizza_type_id: uuid.UUID, db: Session):
    entity = db.query(PizzaType).filter(PizzaType.id == pizza_type_id).first()
    return entity


def get_pizza_type_by_name(pizza_type_name: str, db: Session):
    entity = db.query(PizzaType).filter(PizzaType.name == pizza_type_name).first()
    return entity


def get_all_pizza_types(db: Session):
    entities = db.query(PizzaType).all()
    return entities


def update_pizza_type(pizza_type: PizzaType, changed_pizza_type: PizzaTypeCreateSchema, db: Session):
    for key, value in changed_pizza_type.dict().items():
        setattr(pizza_type, key, value)

    db.commit()
    db.refresh(pizza_type)
    logging.info('PizzaType updated {} with name {}'.format(pizza_type.id, pizza_type.name))
    return pizza_type


def delete_pizza_type_by_id(pizza_type_id: uuid.UUID, db: Session):
    entity = get_pizza_type_by_id(pizza_type_id, db)
    if entity:
        db.delete(entity)
        db.commit()
        logging.info('PizzaType deleted {} with name {}'.format(entity.id, entity.name))


def create_topping_quantity(
        pizza_type: PizzaType,
        schema: PizzaTypeToppingQuantityCreateSchema,
        db: Session,
):
    entity = PizzaTypeToppingQuantity(**schema.dict())
    pizza_type.toppings.append(entity)
    db.commit()
    db.refresh(pizza_type)
    logging.info(
        'Added Topping {} to PizzaType {} with name {}'.format(entity.topping_id, pizza_type.id, pizza_type.name))
    return entity


def get_topping_quantity_by_id(
        pizza_type_id: uuid.UUID,
        topping_id: uuid.UUID,
        db: Session,
):
    entity = db.query(PizzaTypeToppingQuantity) \
        .filter(PizzaTypeToppingQuantity.topping_id == topping_id,
                PizzaTypeToppingQuantity.pizza_type_id == pizza_type_id) \
        .first()
    return entity


def get_joined_topping_quantities_by_pizza_type(
        pizza_type_id: uuid.UUID,
        db: Session,
):
    entities = db.query(PizzaTypeToppingQuantity) \
        .filter(PizzaTypeToppingQuantity.pizza_type_id == pizza_type_id)
    return entities.all()
