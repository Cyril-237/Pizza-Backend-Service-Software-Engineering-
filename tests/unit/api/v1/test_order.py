from app.api.v1.endpoints.order.crud import calculate_price


def test_order_calculate_price_pizza_and_beverage():
    # arrange
    price_pizza = 11
    price_beverage = 4

    # act
    result = calculate_price(price_beverage, price_pizza)

    # assert
    assert result == price_pizza + price_beverage


def test_order_calculate_price_no_pizza():
    # arrange
    price_pizza = None
    price_beverage = 4

    # act
    result = calculate_price(price_beverage, price_pizza)

    # assert
    assert result == price_beverage

def test_order_calculate_price_no_beverage():
    # arrange
    price_beverage = 0
    price_pizza = 11

    # act
    result = calculate_price(price_beverage, price_pizza)

    # assert
    assert result == price_pizza
