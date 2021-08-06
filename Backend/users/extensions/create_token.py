
import datetime
import jwt
from django.conf import settings

def create_token(payload , exp=1440):
    salt = settings.SECRET_KEY

    headers = {
        'typ': 'JWT',
        'alg': 'HS256'
    }
    payload['exp'] =datetime.datetime.utcnow() + datetime.timedelta(minutes=exp)


    token = jwt.encode(payload=payload, key=salt,algorithm='HS256', headers=headers).encode('utf-8')


    return token