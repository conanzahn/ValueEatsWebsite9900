from django.db.models import Count
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

from users.extensions.auth import JwtQueryParamsAuthentication
from repository.models import User,Restaurant, Voucher,Subscription,Comment
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from users.utils import pre_check_params_is_null
from rest_framework.views import APIView,Response
from users.extensions.create_token import create_token
from django.contrib.auth import authenticate
import uuid,os
from backend.settings import MEDIA_ROOT
from functools import reduce


@method_decorator(csrf_exempt, name='dispatch')
def dinerSignup(request):
    data = {
        'title': 'Register',
    }
    if request.method.lower() == 'get':
        return render(request, 'login_register.html', context=data)
    else:
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        postcode = request.POST.get('postcode')
        confirm_password = request.POST.get('confirm_password')
        is_failed, err_msg = pre_check_params_is_null(
            username=username, password=password,
            email=email, postcode=postcode, confirm_password=confirm_password
        )
        if is_failed:
            data.update({'msg': err_msg})
            return JsonResponse(data)

        user_exist = User.objects.filter(Q(username=username)).first()
        if user_exist:
            data.update({
                'msg': 'Username or Email already exists.'
            })
        elif password != confirm_password:
            data.update({
                'msg': 'Two passwords are inconsistent.'
            })
        else:
            User.objects.create(username=username, password=make_password(password),
                                email=email, is_eatery=False, postcode=postcode)

        return JsonResponse(data)


@method_decorator(csrf_exempt, name='dispatch')
class EaterySignup(View):

    # def get(self, request):
    #     return render(request, 'restaurant_signup.html')

    def post(self, request):

        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        address = request.POST.get('address')
        postcode = request.POST.get('postcode')
        cuisines_offered = request.POST.get('cuisines_offered')
        menu = request.FILES.get('menu')
        profile = request.FILES.get('profile')
        # is_eatery = request.POST.get('is_eatery')

        if password != confirm_password:
            data = {'status': 0, 'msg': 'passwords not same'}
            return JsonResponse(data)

        try:
            user_ret = User.objects.create_user(username=username, password=password, is_eatery=True,
                                                postcode=postcode,email=email)

            _uuid = uuid.uuid4()
            save_path = "%s/menu/%s%s" % (MEDIA_ROOT, _uuid, os.path.splitext(menu.name)[-1])
            img_dir = f'/media/menu/{_uuid}{os.path.splitext(menu.name)[-1]}'

            uuid_ = uuid.uuid4()
            profile_save_path =  "%s/profile/%s%s" % (MEDIA_ROOT, uuid_, os.path.splitext(profile.name)[-1])
            profile_img_dir = f'/media/profile/{uuid_}{os.path.splitext(profile.name)[-1]}'

            ret = Restaurant.objects.create(user=user_ret,address=address,cuisines_offered=cuisines_offered,
                                            menu=img_dir,profile=profile_img_dir)

            if ret:
                with open(save_path, 'wb') as f:
                    for content in menu.chunks():
                        f.write(content)

                with open(profile_save_path, 'wb') as f:
                    for content in profile.chunks():
                        f.write(content)

                data = {'status': 1, 'msg': 'success'}
                return JsonResponse(data)
            else:
                data = {'status': 0, 'msg': 'menu upload failed'}
                return JsonResponse(data)

        except Exception as e:

            print(e)

            data = {'status': 0, 'msg': 'username already exists'}
            return JsonResponse(data)


class UserLogin(APIView):
    # authentication_classes = []
    def post(self, request, *arg, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        print(username, password)

        user_object = authenticate(username=username, password=password)

        if not user_object:
            data = {'status': 1404, 'error': 'username or password incorrect'}

            return Response(data)

        token = create_token({'id': user_object.id, 'username': user_object.username, 'iss': 'am0=', }, exp=1440)

        data = {'status': 1202, 'token': token, 'is_eatery': user_object.is_eatery}

        return Response(data)



@method_decorator(csrf_exempt, name='dispatch')
class changePassword(View):

    def post(self, request):
        # if not request.user.is_authenticated:
        #     return JsonResponse({'status': 'no login'})
        username = request.POST.get('username')
        if not username:
            return JsonResponse({'status': 'no post username'})
        user = User.objects.filter(username=username).first()
        oldPassword = request.POST.get('oldPassword')
        newPassword = request.POST.get('newPassword')
        confirmPassword = request.POST.get('confirmPassword')
        if user:
            if not user.check_password(oldPassword):
                return JsonResponse({'status':0, 'msg': 'Current password is incorrect!'})

            if newPassword != confirmPassword:
                return JsonResponse({'status':0, 'msg': 'New password and confirm password need to be the same'})

            User.objects.filter(username=username).update(password=make_password(newPassword))

        return JsonResponse({'status':1, 'msg': 'success'})


class myprofile(APIView):
    # Comfirm the user is logged in
    # Find the user profile according to ID
    # render the profile info to template
    # ！！need a new method when connect with front end
    authentication_classes = [JwtQueryParamsAuthentication, ]

    # def dispatch(self, request, *args, **kwargs):
    #     return super(myprofile, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):

        username = request.user.get('username')

        user = User.objects.filter(username=username).first()
        if user:
            if user.is_eatery:
                restaurant = Restaurant.objects.filter(user=user).first()

                return Response(
                    {'username': user.username, 'email': user.email, 'address': restaurant.address,
                     'postcode': user.postcode, 'cuisines': restaurant.cuisines_offered, 'menu': restaurant.menu})
            else:
                return Response({'username': user.username, 'email': user.email, 'postcode': user.postcode})
        return Response({'status': 'fail'})

    def post(self, request, *args, **kwargs):

        print(request.user)
        oldUsername = request.user.get('username')


        user = User.objects.filter(username=oldUsername).first()
        if not user:
            return Response({'status': 'fail'})

        if user.is_eatery:

            restaurant = Restaurant.objects.filter(user=user).first()
            username = request.data.get('username', user.username)
            email = request.data.get('email', user.email)
            postcode = request.data.get('postcode', user.postcode)

            address = request.data.get('address', restaurant.address)
            cuisines = request.data.get('cuisines_offered', restaurant.cuisines_offered)
            menu = request.data.get('menu', restaurant.menu)

            print(menu)
            try:
                user.username = username
                user.postcode = postcode
                user.email = email
                user.save()

                restaurant.address = address
                restaurant.cuisines_offered = cuisines
                _uuid = uuid.uuid4()

                if not isinstance(menu,str):
                    img_dir = f'/media/menu/{_uuid}{os.path.splitext(menu.name)[-1]}'
                    restaurant.menu = img_dir
                    restaurant.save()
                
                    save_path = "%s/menu/%s%s" % (MEDIA_ROOT, _uuid, os.path.splitext(menu.name)[-1])
                    with open(save_path, 'wb') as f:
                        for content in menu.chunks():
                            f.write(content)
                else:
                    restaurant.save()
                    
                data = {'status':1002,'msg':'success'}
                return Response(data)

            except Exception as e:
                return Response({'stauts': 1004, 'error': 'new username has been registed'})

        else:

            username = request.data.get('username', user.username)
            postcode = request.data.get('postcode', user.postcode)
            email = request.data.get('email', user.email)
            try:
                user.username = username
                user.postcode = postcode
                user.email = email
                user.save()
                return Response({'status': 'succeed'})
            except Exception as e:
                print(e)
                return Response({'stauts':1004,'error': 'new username has been registed' })


class DinerVoucher(APIView):

    authentication_classes = [JwtQueryParamsAuthentication, ]

    def get(self,request):
        username = request.user.get('username')
        try:
            user_obj= User.objects.filter(username=username).first()
            valid_voucher = user_obj.bookvoucher_set.filter(tag=1)
            past_voucher = user_obj.bookvoucher_set.exclude(tag=1)

            valid_voucher = [voucher.valid_voucher for voucher in list(valid_voucher)]
            past_voucher = [voucher.past_voucher for voucher in list(past_voucher)]

            data = {'status':7002,'valid_voucher':valid_voucher,'past_voucher':past_voucher}
            return Response(data)
        except Exception as e:
            print(e)
            data = {'status':7004,'error':'query failed'}
            return Response(data)



class MySubscription(APIView):
    authentication_classes = [JwtQueryParamsAuthentication, ]

    def get(self, request):
        username = request.user.get('username', '')
        try:

            my_sub = Subscription.objects.filter(user__username=username,tag=1)

            if not my_sub:

                data = {'status': 7004,'msg':'query subscription failed'}
                return JsonResponse(data)

            res = []
            for item in my_sub:
                print(item.restaurant)
                temp = Restaurant.objects.filter(user = item.restaurant).first()
                # temp.searchSet['voucher_list'] = []
                res_set = temp.searchSet
                res_set['voucher']=[]
                voucher_list=temp.user.voucher_set.all()
                for voucher in voucher_list:
                    # temp['voucher'].append(voucher.voucherSet)
                    res_set['voucher'].append(voucher.voucherSet)
                comment_obj = Comment.objects.filter(restaurant=item.restaurant)

                reviews = comment_obj.count()
                if reviews:
                    total_stars = reduce(lambda x, y: x + y, [item.stars for item in comment_obj])
                    total_stars = round(total_stars / reviews, 1)
                    reviews = comment_obj.count()
                    res_set.update({'reviews': reviews, 'starts': total_stars})
                else:
                    res_set.update({'reviews': 'Initial value', 'starts': 'Initial value'})
                res.append(res_set)
            data = {'status': 7002, 'data': res}
            return JsonResponse(data)

        except Exception as e:
            print(e)
            data = {'status': 7404,'error':'query subscription failed'}
            return JsonResponse(data)

