import logging
import uuid
from typing import List, Optional, TypeVar
from fastapi import APIRouter, Depends, Request, Response, status, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import app.api.v1.endpoints.beverage.crud as beverage_crud
import app.api.v1.endpoints.pizza_type.crud as pizza_type_crud
import app.api.v1.endpoints.user.crud as user_crud
import app.api.v1.endpoints.order.crud as order_crud
from app.api.v1.endpoints.order.stock_logic import stock_beverage_crud
from app.api.v1.endpoints.order.stock_logic import stock_ingredients_crud
from app.api.v1.endpoints.order.schemas \
    import OrderSchema, PizzaCreateSchema, JoinedPizzaPizzaTypeSchema, \
    PizzaWithoutPizzaTypeSchema, OrderBeverageQuantityCreateSchema, JoinedOrderBeverageQuantitySchema, \
    OrderPriceSchema, OrderBeverageQuantityBaseSchema, OrderCreateSchema, OrderStatus, OrderStatusUpdateSchema
from app.api.v1.endpoints.user.schemas import UserSchema
from app.database.connection import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('', response_model=List[OrderSchema], tags=['order'])
def get_all_orders(
        order_status: Optional[OrderStatus] = Query(None),
        db: Session = Depends(get_db)
):
    if order_status:
        orders = order_crud.get_all_orders_by_status(db, order_status)
    else:
        orders = order_crud.get_all_orders(db)
    return orders


@router.post('', response_model=OrderSchema, status_code=status.HTTP_201_CREATED, tags=['order'])
def create_order(order: OrderCreateSchema, db: Session = Depends(get_db),
                 copy_order_id: Optional[uuid.UUID] = None):
    if user_crud.get_user_by_id(order.user_id, db) is None:
        logging.error('Order not created because user {} not found'.format(order.user_id))
        raise HTTPException(status_code=404)
    # Create Order
    new_order = order_crud.create_order(order, db)
    # Check if Copy Order is specified
    if copy_order_id is None:
        return new_order
    # Check Copy Order
    copy_order = order_crud.get_order_by_id(copy_order_id, db)
    if not copy_order:
        order_crud.delete_order_by_id(new_order.id, db)
        logging.error('Order not created because copy order {} not found'.format(copy_order_id))
        raise HTTPException(status_code=404)
    # Copy Pizzas
    for pizza in copy_order.pizzas:
        pizza_type = pizza.pizza_type
        if not stock_ingredients_crud.ingredients_are_available(pizza_type):
            # Not enough Stock
            order_crud.delete_order_by_id(new_order.id, db)
            logging.error('Order not created because not enough Pizza in Stock')
            raise HTTPException(status_code=409)
        order_crud.add_pizza_to_order(new_order, pizza_type, db)
        stock_ingredients_crud.reduce_stock_of_ingredients(pizza_type, db)
    # Copy Beverages
    for beverage_quantity in copy_order.beverages:
        schema = OrderBeverageQuantityCreateSchema(
            **{'quantity': beverage_quantity.quantity, 'beverage_id': beverage_quantity.beverage_id})
        if not stock_beverage_crud.change_stock_of_beverage(beverage_quantity.beverage_id,
                                                            -beverage_quantity.quantity, db):
            # Not enough Stock
            order_crud.delete_order_by_id(new_order.id, db)
            logging.error('Order not created because not enough Beverages in Stock')
            raise HTTPException(status_code=409)
        order_crud.create_beverage_quantity(new_order, schema, db)
    return new_order


@router.get('/{order_id}', response_model=OrderSchema, tags=['order'])
def get_order(
        order_id: uuid.UUID,
        db: Session = Depends(get_db)):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    return order


@router.delete('/{order_id}', response_model=None, tags=['order'])
def delete_order(
        order_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Order {} not deleted because not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    ordered_pizzas = order.pizzas
    if ordered_pizzas:
        for pizza in ordered_pizzas:
            stock_ingredients_crud.increase_stock_of_ingredients(pizza.pizza_type, db)
    order_beverages = order_crud.get_joined_beverage_quantities_by_order(order_id, db)
    if order_beverages:
        for order_beverage in order_beverages:
            stock_beverage_crud.change_stock_of_beverage(order_beverage.beverage.id, order_beverage.quantity, db)
    order_crud.delete_order_by_id(order_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/{order_id}/status',
            status_code=status.HTTP_200_OK,
            response_model=OrderStatus,
            tags=['order'],
            )
def get_order_status(
        order_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not get Order status because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)

    order_status = order.order_status
    return order_status


@router.put('/{order_id}/status', response_model=OrderStatus, tags=['order'])
def update_order_status_endpoint(
        order_id: uuid.UUID,
        status_update: OrderStatusUpdateSchema = Query(None),
        db: Session = Depends(get_db)
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not update Order status because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    updated_order = order_crud.update_order_status_by_id(order_id, status_update.status, db)
    if not updated_order:
        logging.error('Order {} not found for status update'.format(order_id))
        raise HTTPException(status_code=404)
    logging.info('Order {} status updated to {}'.format(order_id, status_update.status))
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post('/{order_id}/pizzas', response_model=PizzaWithoutPizzaTypeSchema, tags=['order'])
def add_pizza_to_order(
        order_id: uuid.UUID,
        schema: PizzaCreateSchema,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not add Pizza to Order because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    pizza_type = pizza_type_crud.get_pizza_type_by_id(schema.pizza_type_id, db)
    if not pizza_type:
        logging.error(
            'Can not add Pizza to Order {} because PizzaType {} not found'.format(order_id, schema.pizza_type_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    if not stock_ingredients_crud.ingredients_are_available(pizza_type):
        logging.error(
            'Can not add Pizza to Order {} because not enough stock ingredients available for PizzaType {}'.format(
                order_id, schema.pizza_type_id))
        return Response(status_code=status.HTTP_409_CONFLICT)
    stock_ingredients_crud.reduce_stock_of_ingredients(pizza_type, db)
    pizza = order_crud.add_pizza_to_order(order, pizza_type, db)
    return pizza


@router.get('/{order_id}/pizzas', response_model=List[JoinedPizzaPizzaTypeSchema], tags=['order'])
def get_pizzas_from_order(
        order_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not get Pizza because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    pizzas = order_crud.get_all_pizzas_of_order(order, db)
    return pizzas


@router.delete('/{order_id}/pizzas', response_model=None, tags=['order'])
def delete_pizza_from_order(
        order_id: uuid.UUID,
        pizza: PizzaWithoutPizzaTypeSchema,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not delete Pizza from Order because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    pizza_entity = order_crud.get_pizza_by_id(pizza.id, db)
    if not pizza_entity:
        logging.error('Can not delete Pizza from Order because Pizza {} not found'.format(pizza.id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    stock_ingredients_crud.increase_stock_of_ingredients(pizza_entity.pizza_type, db)
    if not order_crud.delete_pizza_from_order(order, pizza.id, db):
        logging.error('Can not delete Pizza from Order because Order {} has no Pizza {}'.format(order.id, pizza.id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    return Response(status_code=status.HTTP_200_OK)


# Due to mypy error, this workaround is needed for Union
# see pull request https://github.com/python/mypy/pull/8779
# should be fixed in near future
MyPyEitherItem = TypeVar(
    'MyPyEitherItem',
    List[OrderBeverageQuantityCreateSchema],
    List[JoinedOrderBeverageQuantitySchema],
    None,
)


@router.get(
    '/{order_id}/beverages',
    response_model=MyPyEitherItem,
    tags=['order'],
)
def get_order_beverages(
        order_id: uuid.UUID,
        db: Session = Depends(get_db),
        join: bool = False,
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not get Beverages because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    order = order_crud.get_order_by_id(order_id, db)
    beverages = order.beverages
    if join:
        beverages = order_crud.get_joined_beverage_quantities_by_order(order.id, db)
    return beverages


@router.post(
    '/{order_id}/beverages',
    response_model=OrderBeverageQuantityCreateSchema,
    status_code=status.HTTP_201_CREATED,
    tags=['order'],
)
def create_order_beverage(
        order_id: uuid.UUID,
        beverage_quantity: OrderBeverageQuantityCreateSchema,
        request: Request,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not add Beverage to Order because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    # Check if new Quantity is valid
    if beverage_quantity.quantity <= 0:
        logging.error('Can not add invalid Beverage quantity {}'.format(beverage_quantity.quantity))
        raise HTTPException(status_code=422)
    beverage = beverage_crud.get_beverage_by_id(beverage_quantity.beverage_id, db)
    if not beverage:
        logging.error(
            'Can not add Beverage to Order because Beverage {} not found'.format(beverage_quantity.beverage_id))
        raise HTTPException(status_code=404)
    beverage_quantity_found = order_crud.get_beverage_quantity_by_id(order_id, beverage_quantity.beverage_id, db)
    if beverage_quantity_found:
        url = request.url_for('get_order_beverages', order_id=beverage_quantity_found.order_id)
        return RedirectResponse(url=url, status_code=status.HTTP_303_SEE_OTHER)
    # Change Stock of Beverage if enough is available
    if not stock_beverage_crud.beverage_is_available(beverage_quantity.beverage_id, beverage_quantity.quantity, db):
        logging.error('Can not add Beverage to Order because not enough stock available')
        raise HTTPException(status_code=409, detail='Conflict')
    stock_beverage_crud.change_stock_of_beverage(beverage_quantity.beverage_id, -beverage_quantity.quantity, db)
    new_beverage_quantity = order_crud.create_beverage_quantity(order, beverage_quantity, db)
    return new_beverage_quantity


@router.put(
    '/{order_id}/beverages',
    response_model=OrderBeverageQuantityBaseSchema,
    tags=['order'],
)
def update_beverage_of_order(
        order_id: uuid.UUID,
        beverage_quantity: OrderBeverageQuantityCreateSchema,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not update Beverage in Order because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    # Check if new Quantity is valid
    if beverage_quantity.quantity <= 0:
        logging.error('Can not update Order with invalid Beverage quantity {}'.format(beverage_quantity.quantity))
        return Response(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    beverage_id = beverage_quantity.beverage_id
    order_beverage_quantity = order_crud.get_beverage_quantity_by_id(order_id, beverage_id, db)
    if not order_beverage_quantity:
        logging.error('Can not update Beverage in Order because Beverage {} not found'.format(beverage_id))
        raise HTTPException(status_code=404)
    new_quantity = beverage_quantity.quantity
    old_quantity = order_beverage_quantity.quantity
    # Change Stock if enough is available: change Amount is Previous - New
    if not stock_beverage_crud.change_stock_of_beverage(beverage_id, old_quantity - new_quantity, db):
        logging.error('Can not update Beverage in Order because not enough stock available')
        raise HTTPException(status_code=409)
    # Update
    new_order_beverage_quantity = order_crud.update_beverage_quantity_of_order(
        order_id, beverage_quantity.beverage_id, beverage_quantity.quantity, db)
    # Return updated OrderBeverageQuantity
    if new_order_beverage_quantity:
        return new_order_beverage_quantity
    else:
        logging.error('Can not update Beverage because update failed')
        raise HTTPException(status_code=404)


@router.delete(
    '/{order_id}/beverages', response_model=None, tags=['order'],
)
def delete_beverage_from_order(
        order_id: uuid.UUID,
        beverage_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not delete Beverage from Order because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    order_beverage = order_crud.get_beverage_quantity_by_id(order_id, beverage_id, db)
    if not order_beverage:
        logging.error('Can not delete Beverage from Order because Beverage {} not found'.format(beverage_id))
        raise HTTPException(status_code=404)
    # Increase Stock by the quantity of the deleted order
    order_quantity = order_beverage.quantity
    stock_beverage_crud.change_stock_of_beverage(beverage_id, order_quantity, db)
    # Delete OrderBeverageQuantity
    order_crud.delete_beverage_from_order(order_id, beverage_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    '/{order_id}/price',
    status_code=status.HTTP_200_OK,
    response_model=OrderPriceSchema,
    tags=['order'],
)
def get_price_of_order(
        order_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not get Order price because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    price = order_crud.get_price_of_order(order_id, db)
    return OrderPriceSchema(**{
        'price': price,
    })


@router.get('/{order_id}/user',
            status_code=status.HTTP_200_OK,
            response_model=UserSchema,
            tags=['order'],
            )
def get_user_of_order(
        order_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    order = order_crud.get_order_by_id(order_id, db)
    if not order:
        logging.error('Can not get User from Order because order {} not found'.format(order_id))
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    # dupe or bug?
    # order = order_crud.get_order_by_id(order_id, db)
    # if not order:
    #    raise HTTPException(status_code=404)
    user = order.user
    return user
