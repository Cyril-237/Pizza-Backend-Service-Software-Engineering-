import logging
import uuid

from sqlalchemy.orm import Session

import app.api.v1.endpoints.beverage.crud as beverage_crud
from app.database.models import Beverage


def beverage_is_available(beverage_id: uuid.UUID, amount: int, db: Session):
    # Get Beverage
    beverage = beverage_crud.get_beverage_by_id(beverage_id, db)
    # Check if Beverage exists
    if beverage:
        # If there is enough stock return true. Stock CAN be zero
        return beverage.stock >= amount
    else:
        return False


def change_stock_of_beverage(beverage_id: uuid.UUID, change_amount: int, db: Session):
    # Get Beverage
    beverage = db.query(Beverage).filter(Beverage.id == beverage_id).first()

    # Check if Beverage exists and if Stock is not getting smaller than zero
    if beverage and beverage.stock + change_amount >= 0:
        setattr(beverage, 'stock', beverage.stock + change_amount)
        db.commit()
        db.refresh(beverage)
        logging.info('Beverage {} Stock changed by {}'.format(beverage_id, change_amount))
        return True

    return False
