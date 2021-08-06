from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt
from jwt import exceptions


class JwtQueryParamsAuthentication(BaseAuthentication):

    def authenticate(self, request):

        token = request.query_params.get('token')

        salt = settings.SECRET_KEY
        payload = None
        msg = None
        data=None
        try:
            payload = jwt.decode(token, salt, algorithms='HS256',options={'verify_exp': True})
            # print(payload)
        except exceptions.ExpiredSignatureError:

            msg = 'signature has expired'

            data = {'status':2404,'error':msg}
            raise  AuthenticationFailed(data)
        except jwt.DecodeError:
            msg = 'token decode failed'
            data = {'status': 2404, 'error': msg}
            raise AuthenticationFailed(data)
        except jwt.InvalidTokenError:
            msg = "invalid token"
            data = {'status': 2404, 'error': msg}
            raise AuthenticationFailed(data)


        return (payload,token)


