from django.urls import path

from .views import *


urlpatterns = [

    path('myProfile/', myprofile.as_view()),
    path('changePassword/', changePassword.as_view()),
    path('dinerVoucher/',DinerVoucher.as_view()),
    path('mySubscription/', MySubscription.as_view()),
]
