def pre_check_params_is_null(**kwargs):
    for key, value in kwargs.items():
        if not value:
            return True, f'param {key.capitalize()} can not be empty'
    return False, ''

