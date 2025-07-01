import logging
import uuid

from sqlalchemy.orm import Session

from app.api.v1.endpoints.user.schemas import UserCreateSchema
from app.database.models import Order
from app.database.models import User


def create_user(schema: UserCreateSchema, db: Session):
    entity = User(**schema.model_dump())
    db.add(entity)
    db.commit()
    logging.info('User created {} with username {}'.format(entity.id, entity.username))
    return entity


def get_user_by_username(username: str, db: Session):
    entity = db.query(User).filter(User.username == username).first()
    return entity


def get_user_by_id(user_id: uuid.UUID, db: Session):
    entity = db.query(User).filter(User.id == user_id).first()
    return entity


def get_all_users(db: Session):
    entities = db.query(User).all()
    return entities


def update_user(user: User, changed_user: UserCreateSchema, db: Session):
    for key, value in changed_user.dict().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    logging.info('User updated {} with username {}'.format(user.id, user.username))
    return user


def delete_user_by_id(user_id: uuid.UUID, db: Session):
    entity = get_user_by_id(user_id, db)
    if entity:
        db.delete(entity)
        db.commit()
        logging.info('User deleted {} with username {}'.format(entity.id, entity.username))


def get_order_history_of_user(user_id: uuid.UUID, db: Session):
    entities = db.query(Order) \
        .filter(Order.user_id == user_id) \
        .filter(Order.order_status == 'COMPLETED').all()
    return entities


def get_open_orders_of_user(user_id: uuid.UUID, db: Session):
    entities = db.query(Order) \
        .filter(Order.user_id == user_id) \
        .filter(Order.order_status != 'COMPLETED').all()
    return entities


def get_all_not_completed_orders(db: Session):
    entities = db.query(Order) \
        .filter(Order.order_status != 'COMPLETED').all()
    return entities
