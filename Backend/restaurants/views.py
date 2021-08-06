import datetime
import uuid
from functools import reduce

import jwt
from django.db import connection
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView, Response

from backend import settings
from repository.models import Restaurant, User, Voucher, Comment, BookVoucher, Subscription
from users.extensions.auth import JwtQueryParamsAuthentication


# Create your views here.


class CreateVoucher(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        print(username)
        if username != request.user.get('username'):
            return Response({'status': 3003, 'error': 'you do not have right to create other restaurant voucher'})

        voucher_code = request.data.get('voucher_code')
        discount = request.data.get('discount')
        start_time = request.data.get('start_time')
        start_date = request.data.get('start_date')
        end_time = request.data.get('end_time')
        voucher_amount = request.data.get('voucher_amount')
        repeat_type = request.data.get('repeat_type')

        discount = float(discount.strip('%'))
        discount = discount / 100

        discount = round(discount, 2)
        start_date_new = datetime.datetime.strptime(start_date, '%Y-%m-%d')
        print(start_date)
        week_day = start_date_new.weekday()

        '''
        sunday:1
        monday:2
        ...
        saturday:0
        '''

        try:
            user = User.objects.filter(username=username).first()
            if not user:
                return Response({'stauts': 2004, 'error': 'restaurant name is wrong.'})
            if not user.is_eatery:
                return Response({'status': 2005, 'error': 'diner do not have right'})

            user_obj = get_object_or_404(User, username=username)
            Voucher.objects.create(user=user_obj, restaurant_name=username, voucher_code=voucher_code,
                                   discount=discount, start_time=start_time, start_date=start_date,
                                   end_time=end_time, amount=voucher_amount, repeat_type=repeat_type,
                                   week_day=week_day)
            data = {'status': 1200, 'msg': 'success'}
            return Response(data)
        except Exception as e:
            print(e)

            data = {'status': 1204, 'msg': 'create voucher failed'}
            return Response(data)


class NavRestaurant(APIView):

    def get(self, request, *args, **kwargs):
        username = kwargs.get('username')
        user_obj = User.objects.filter(username=username, is_eatery=True).first()
        print(user_obj)
        if not user_obj:
            data = {'status': 3004, 'error': 'username incorrect'}
            return Response(data)
        res_obj = Restaurant.objects.filter(user=user_obj).values('address', 'cuisines_offered', 'menu', 'profile')
        res = list(res_obj)[0]
        res['email'] = user_obj.email
        res['postcode'] = user_obj.postcode
        res['restaurant_name'] = user_obj.username

        # voucher status

        voucher_status = [[] for i in range(7)]

        voucher_set = user_obj.voucher_set.all()

        for voucher in voucher_set:
            voucher_status[int(voucher.week_day)].append(voucher.voucherSet)

        try:
            comment_obj = Comment.objects.filter(restaurant=user_obj)
            reviews = comment_obj.count()

            total_stars = reduce(lambda x, y: x + y, [item.stars for item in comment_obj])
            total_stars = round(total_stars / reviews, 1)
            reviews = comment_obj.count()
            res.update({'reviews': reviews, 'starts': total_stars})
            comments = [{'comment': item.comment, 'create_time': item.create_time.strftime('%Y-%m-%d %H:%M'),
                         'diner': item.diner.username}
                        for item in comment_obj]
        except Exception as e:

            print(e)
            data = {'status': 3001, 'res': res, 'voucher_status': voucher_status, 'comments': []}
            return Response(data)

        data = {'status': 3001, 'res': res, 'comments': comments, 'voucher_status': voucher_status}
        return Response(data)


class MyVoucher(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def get(self, request, *args, **kwargs):
        username = request.user.get('username')
        user_obj = User.objects.filter(username=username).first()
        if not user_obj.is_eatery:
            return Response({'status': 4004, 'error': 'diner accouant has no right'})
        voucher_obj = Voucher.objects.filter(user=user_obj)
        res = []
        for voucher in voucher_obj:
            temp = {}
            available = int(voucher.amount - voucher.used)
            temp['id'] = voucher.id
            temp['voucher_code'] = voucher.voucher_code
            temp['discount'] = voucher.discount
            temp['amount'] = voucher.amount
            temp['repeat_type'] = voucher.repeat_type
            temp['available'] = available
            res.append(temp)

        print(res)

        data = {'status': 4001, 'res': res}

        return Response(data)


class MyVoucherDetails(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def get(self, request, *args, **kwargs):
        username = request.user.get('username')
        pk = request.query_params.get('id')
        voucher = Voucher.objects.filter(id=pk).first()
        if voucher.user.username != username:
            return Response({'status': 4001, 'error': 'you do not have the right'})

        voucher = Voucher.objects.filter(id=pk).values()
        data = {'voucher': list(voucher)}

        return Response(data)


class SearchDiscount(APIView):

    def get(self,request,*args,**kwargs):

        query = request.query_params.get('q')
        start_date = request.query_params.get('start_date')
        start_time = request.query_params.get('start_time')


        rest_list =[]

        res = User.objects.filter(Q(username__icontains=query)|Q(postcode=query),is_eatery=True)
        res_ = Restaurant.objects.filter(cuisines_offered__icontains=query)




        if not start_date :
            if res:
                for user in res:

                    voucher_status = [[] for i in range(7)]

                    temp = Restaurant.objects.filter(user=user).first().searchSet

                    voucher_set = user.voucher_set.all()

                    for voucher in voucher_set:
                        voucher_status[int(voucher.week_day)].append(voucher.voucherSet)

                    temp['voucher_status']=voucher_status
                    rest_list.append(temp)
                data = {'status': 5001, 'rest_list': rest_list}
                return Response(data)

            elif res_:

                for restaurant in res_:
                    voucher_status = [[] for i in range(7)]
                    temp = restaurant.searchSet
                    voucher_set = restaurant.user.voucher_set.all()

                    for voucher in voucher_set:
                        voucher_status[int(voucher.week_day)].append(voucher.voucherSet)

                    temp['voucher_status'] = voucher_status
                    rest_list.append(temp)

                data = {'status': 5001, 'rest_list': rest_list}
                return Response(data)
            else:
                data = {'status': 5002, 'rest_list': None}
                return Response(data)
        else:
            if res:
                for user in res:
                    print(user)
                    voucher_status = [[] for i in range(7)]

                    for item in user.voucher_set.all():
                        if start_date == item.start_date and item.end_time>=start_time>=item.start_time:

                            voucher_status[int(item.week_day)].append(item.voucherSet)

                    temp = Restaurant.objects.filter(user=user).first().searchSet
                    temp['voucher_status'] = voucher_status
                    rest_list.append(temp)
                data = {'status': 5001, 'rest_list': rest_list}

                return Response(data)

            elif res_:

                for restaurant in res_:
                    voucher_status = [[] for i in range(7)]

                    for item in restaurant.user.voucher_set.all():

                        if start_date == item.start_date and item.end_time>=start_time>=item.start_time:
                            voucher_status[int(item.week_day)].append(item.voucherSet)
                    temp = restaurant.searchSet
                    temp['voucher_status'] = voucher_status
                    rest_list.append(temp)
                data = {'status':5001,'rest_list':rest_list}

                return Response(data)
            else:
                data = {'status': 5002, 'rest_list': None}
                return Response(data)


class BookTheVoucher(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def post(self, request, *args, **kwargs):
        username = request.user.get('username')

        voucher_id = request.data.get('voucher')
        voucher_id = int(voucher_id)
        reservation_name = request.data.get('reservation_name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        person_num = request.data.get('person_num')
        requirements = request.data.get('requirements', ' ')
        requirements = requirements.strip(' ')

        user_obj = User.objects.filter(username=username).first()
        print(user_obj.username)

        voucher = Voucher.objects.get(id=voucher_id)
        verify_code = uuid.uuid1()
        verify_list = str(verify_code).split('-')
        verify_code = voucher.voucher_code + '-' + verify_list[0] + verify_list[1]
        print(verify_code)
        print(voucher.user)
        try:
            print(voucher.used)
            if voucher.used < voucher.amount:

                BookVoucher.objects.create(user=user_obj, voucher_id=voucher_id, verify_code=verify_code,
                                           reservation_name=reservation_name, email=email,
                                           phone=phone, person_num=person_num, requirements=requirements)
                Subscription.objects.update_or_create(
                    defaults={'user_id': user_obj.id, 'restaurant_id': voucher.user.id, 'tag': 1},

                    user=user_obj, restaurant=voucher.user, tag=1)

                data = {'status': 6001, 'msg': 'book voucher success'}
                return Response(data)
            else:
                data = {'status': 6004, 'msg': 'book voucher available is zero'}
                return Response(data)
        except Exception as e:
            print(e)
            data = {'stauts': 6004, 'msg': 'book voucher failed'}
            return Response(data)


class VerifyVoucher(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def post(self, request):

        restaurant_name = request.user.get('username', '')
        verify_code = request.data.get('verify_code')
        print(verify_code)

        ret = BookVoucher.objects.filter(verify_code=verify_code, voucher__user__username=restaurant_name, tag=1)
        print(ret)

        if ret:
            voucher = ret.first().voucher.voucherSet
            # voucher.amount -= 1
            # voucher.save()
            # time = datetime.datetime.strftime(datetime.datetime.now(),'%Y-%m-%d %H:%M:%S')
            # ret.update(tag= time)

            # print(time)
            data = {'status': 1, 'voucher_details': voucher, 'boock_voucher': ret.values()}
            return Response(data)

        else:

            data = {'status': 0, 'error': "verify failed"}

        return Response(data)


class ConfirmVoucher(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def post(self, request):

        restaurant_name = request.user.get('username', '')
        verify_code = request.data.get('verify_code')

        ret = BookVoucher.objects.filter(verify_code=verify_code, voucher__user__username=restaurant_name, tag=1)
        print(ret)

        if ret:

            time = datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S')
            ret.update(tag=time)
            data = {'status': 1, 'msg': 'confirm success'}
            return Response(data)
        else:
            data = {'status': 0, 'error': "confirm failed"}
            return Response(data)


class AddReview(APIView):
    '''
    add review
    '''

    authentication_classes = [JwtQueryParamsAuthentication, ]

    def post(self, request, *args, **kwargs):

        username = request.data.get('username')
        restaurant_name = request.data.get('restaurant_name')
        comment = request.data.get('comment')
        food = request.data.get('food')
        service = request.data.get('service')

        print(username, restaurant_name, comment)

        diner_obj = get_object_or_404(User, username=username, is_eatery=False)
        restaurant_obj = get_object_or_404(User, username=restaurant_name, is_eatery=True)

        try:
            comment_obj = Comment.objects.create(diner=diner_obj, restaurant=restaurant_obj, comment=comment,
                                                 food=food, service=service)
            data = {'status': 4001, 'error': 'add review success'}
            return Response(data)


        except Exception as e:
            print(e)

            data = {'status': 4004, 'error': 'add review failed'}
            return Response(data)


class Recommended(APIView):

    def get(self, request):
        token = request.query_params.get('token')
        salt = settings.SECRET_KEY
        try:
            payload = jwt.decode(token, salt, algorithms='HS256', options={'verify_exp': True})
        except:
            payload = {}
        uid = payload.get('id', 0)
        # k = request.GET.get('k', 1)
        # k = int(k)
        user = User.objects.filter(id=uid).first()
        if user:
            postcode = user.postcode
        else:
            postcode = 0
        postcode_rest = Restaurant.objects.filter(
            user__postcode=postcode,
            user__voucher__isnull=False
        ).exclude(
            user__bookvoucher__user_id=uid
        ).values()
        select_data = {
            'user__voucher__isnull': False,
        }
        if postcode_rest:
            select_data.update({'user__postcode': postcode})
        else:
            select_data.update(
                {'user__postcode__in': [str(one) for one in range(int(postcode) - 10, int(postcode) + 10)]})
        ret_data = Restaurant.objects.filter(**select_data).exclude(
            user__bookvoucher__user_id=uid
        ).distinct().values('user__username', 'address', 'cuisines_offered', 'profile',
                            'menu', 'user__postcode', 'user_id')
        # ret_data = None

        if not ret_data:
            cursor = connection.cursor()
            # 查询操作
            sql_ = "select c.restaurant_id as id, count(c.comment) as cc from repository_comment c where " \
                   'c.comment like "%good%" ' \
                   'or c.comment like "%great%" ' \
                   'group by c.restaurant_id'

            cursor.execute(
                'select u.username as user__username, address, cuisines_offered, profile, '
                'menu, u.postcode as user__postcode, user_id, '
                '(avg(c.food)+avg(c.service))/2 as level, '
                'ccount.cc as comment_count '
                'from repository_restaurant r '
                'join repository_user u on u.id=r.user_id '
                'join repository_comment c on c.restaurant_id=r.id '
                'left join (%s) ccount on r.id = ccount.id '
                "where r.id=c.restaurant_id group by c.restaurant_id "
                "order by level desc, comment_count desc " % sql_)
            columns = [col[0] for col in cursor.description]
            ret_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        if not ret_data:
            ret_data = Restaurant.objects.filter(
                user__voucher__isnull=False
            ).distinct().values('user__username', 'address', 'cuisines_offered', 'menu',
                           'user__postcode', 'user_id', 'profile')
        apparel_map = [one['cuisines_offered'] for one in postcode_rest]
        ret_data = sorted(ret_data, key=lambda x: apparel_map.index(
            x['cuisines_offered']) if x['cuisines_offered'] in apparel_map else 99)
        for one in ret_data:
            voucher_status = [[] for i in range(7)]
            temp = Voucher.objects.filter(user_id=one['user_id']).values()
            tmp = list(temp)
            for ones in tmp:
                voucher_status[int(ones['week_day'])].append(ones)
            one['voucher_status'] = voucher_status
        return JsonResponse({'data': list(ret_data)})
