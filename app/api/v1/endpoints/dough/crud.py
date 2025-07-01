import logging
import uuid

from sqlalchemy.orm import Session

from app.api.v1.endpoints.dough.schemas import DoughCreateSchema
from app.database.models import Dough


def create_dough(schema: DoughCreateSchema, db: Session):
    entity = Dough(**schema.dict())
    db.add(entity)
    db.commit()
    logging.info('Dough created {} with name {}'.format(entity.id, entity.name))
    return entity


def get_dough_by_id(dough_id: uuid.UUID, db: Session):
    entity = db.query(Dough).filter(Dough.id == dough_id).first()
    return entity


def get_dough_by_name(dough_name: str, db: Session):
    entity = db.query(Dough).filter(Dough.name == dough_name).first()
    return entity


def get_all_doughs(db: Session):
    return db.query(Dough).all()


def update_dough(dough: Dough, changed_dough: DoughCreateSchema, db: Session):
    for key, value in changed_dough.dict().items():
        setattr(dough, key, value)

    db.commit()
    db.refresh(dough)
    logging.info('Dough updated {} with name {}'.format(dough.id, dough.name))
    return dough


def delete_dough_by_id(dough_id: uuid.UUID, db: Session):
    entity = get_dough_by_id(dough_id, db)
    if entity:
        db.delete(entity)
        db.commit()
        logging.info('Dough deleted {} with name {}'.format(entity.id, entity.name))
