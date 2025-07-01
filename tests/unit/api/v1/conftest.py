import uuid

import pytest


# Declared here to use in multiple files
@pytest.fixture(scope='module')
def create_real_address():
    return {
        'street': 'Christophorusring',
        'post_code': '65618',
        'house_number': 41,
        'country': 'Deutschland',
        'town': 'Selters',
        'first_name': 'Rainer',
        'last_name': 'Zufall',
        'id': uuid.uuid4(),
    }
