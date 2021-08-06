"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from users.views import dinerSignup,EaterySignup,UserLogin
from restaurants.views import SearchDiscount



urlpatterns = [
    path('admin/', admin.site.urls),
    path('dinerSignup/', dinerSignup),
    path('eaterySignup/',EaterySignup.as_view()),
    path('login/', UserLogin.as_view()),
    path('searchDiscount/', SearchDiscount.as_view()),

    path('restaurant/',include('restaurants.urls')),
    path('users/',include('users.urls')),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL)
