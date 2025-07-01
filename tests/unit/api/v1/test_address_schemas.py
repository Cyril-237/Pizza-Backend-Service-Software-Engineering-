from app.api.v1.endpoints.order.address.schemas import AddressSchema, AddressBaseSchema, AddressCreateSchema


def test_address_base_schema(create_real_address):
    schema = AddressBaseSchema(**create_real_address)
    assert hasattr(schema, 'street')
    assert hasattr(schema, 'post_code')
    assert hasattr(schema, 'house_number')
    assert hasattr(schema, 'country')
    assert hasattr(schema, 'town')
    assert hasattr(schema, 'first_name')
    assert hasattr(schema, 'last_name')
    assert not hasattr(schema, 'id')


def test_address_schema(create_real_address):
    schema = AddressSchema(**create_real_address)
    assert hasattr(schema, 'id')


def test_address_create_schema(create_real_address):
    schema = AddressCreateSchema(**create_real_address)
    assert hasattr(schema, 'street')
    assert hasattr(schema, 'post_code')
    assert hasattr(schema, 'house_number')
    assert hasattr(schema, 'country')
    assert hasattr(schema, 'town')
    assert hasattr(schema, 'first_name')
    assert hasattr(schema, 'last_name')
    assert not hasattr(schema, 'id')
