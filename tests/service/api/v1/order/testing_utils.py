def check_for_id_in_response_list(response, element_id):
    json = response.json()
    for element in json:
        current_id = element.get('id')
        if current_id == element_id:
            break

    assert current_id == element_id
