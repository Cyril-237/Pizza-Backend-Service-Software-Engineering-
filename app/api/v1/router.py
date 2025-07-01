from fastapi import APIRouter

from app.api.v1.endpoints.beverage.router import router as beverage_router
from app.api.v1.endpoints.dough.router import router as dough_router
from app.api.v1.endpoints.order.router import router as order_router
from app.api.v1.endpoints.pizza_type.router import router as pizza_type_router
from app.api.v1.endpoints.topping.router import router as topping_router
from app.api.v1.endpoints.user.router import router as user_router
from app.api.v1.endpoints.sauce.router import router as sauce_router

router = APIRouter()

router.include_router(pizza_type_router, prefix='/pizza-types')
router.include_router(topping_router, prefix='/toppings')
router.include_router(dough_router, prefix='/doughs')
router.include_router(order_router, prefix='/order')
router.include_router(user_router, prefix='/users')
router.include_router(beverage_router, prefix='/beverages')
router.include_router(sauce_router, prefix='/sauces')
