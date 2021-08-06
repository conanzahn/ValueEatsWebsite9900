from django.urls import path,include
from restaurants import views

urlpatterns = [
    # path('signup/',views.Signup.as_view()),
    path('createVoucher/', views.CreateVoucher.as_view()),

    path('myVoucher/',views.MyVoucher.as_view()),
    path('myVoucherDetails/', views.MyVoucherDetails.as_view()),

    path('restaurant/<str:username>/',views.NavRestaurant.as_view()),


    #book  a voucher
    path('bookVoucher/',views.BookTheVoucher.as_view()),
    path('verifyVoucher/', views.VerifyVoucher.as_view()),
    path('confirmVoucher/',views.ConfirmVoucher.as_view()),
    path('addReview/',views.AddReview.as_view()),
    path('Recommended/', views.Recommended.as_view()),


]
