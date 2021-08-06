from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime


# Create your models here.


class User(AbstractUser):
    """
    我们直接继承django自带的用户模型
    该模型自带了password，username，email字段
    """

    is_eatery = models.BooleanField(default=True)
    postcode = models.CharField(max_length=4, null=True, blank=True)

    def __str__(self):
        return "{}{}".format(self.id, self.username)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = verbose_name


class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    address = models.CharField(max_length=100)

    STATUS_CHOICES = (
        ('Burgers', 'Burgers'),
        ('Fast Food', 'Fast Food'),
        ('Chicken', 'Chicken'),
        ('Pizza', 'Pizza'),
        ('Asian', 'Asian'),
        ('BBQ', 'BBQ'),
        ('Cafe', 'Cafe'),
        ('Vegan', 'Vegan'),
        ('Others', 'Others'),
    )
    cuisines_offered = models.CharField(verbose_name='cuisines_offered', max_length=50, choices=STATUS_CHOICES,
                                        blank=True, null=True)
    menu = models.CharField(verbose_name='menu', max_length=100, blank=False)
    profile = models.CharField(verbose_name='profile', max_length=100, blank=False)

    create_time = models.DateTimeField(verbose_name='create_time', auto_now_add=True)
    tag = models.CharField(max_length=1, default="1")

    @property
    def searchSet(self):
        """
        这个函数的作用是把数据库对应的数据字段转为字典格式，方便传入到django前端模板使用
        """
        return {
            'id': self.id, 'restaurant_name': self.user.username, 'menu': self.menu,
            'profile': self.profile, 'address': self.address, 'cuisines_offered': self.cuisines_offered,
            'postcode': self.user.postcode

        }

    objects = models.Manager()

    def __str__(self):
        return "{}{}".format(self.id, self.user)

    class Meta:
        verbose_name = "restaurant"
        verbose_name_plural = verbose_name


class Voucher(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="user")

    voucher_code = models.CharField(verbose_name='voucher_code', max_length=50, blank=False)
    restaurant_name = models.CharField(verbose_name='restaurant_name', max_length=50, blank=False)
    discount = models.FloatField(verbose_name='discount')
    start_time = models.CharField(verbose_name='start_time', max_length=50, blank=False)
    start_date = models.CharField(verbose_name='start_date', max_length=50, blank=False)

    end_time = models.CharField(verbose_name='end_time', max_length=50, blank=False)
    week_day = models.CharField(verbose_name='week_day', max_length=50, blank=False)
    repeat_type = models.CharField(verbose_name='repeat_type', max_length=50, blank=False)
    amount = models.IntegerField(verbose_name='amount', default=1)

    create_time = models.DateTimeField(verbose_name='create_time', auto_now_add=True)
    tag = models.CharField(max_length=1, default="1")
    objects = models.Manager()

    @property
    def used(self):
        return self.BookVoucher.count()

    @property
    def voucherSet(self):
        res = {'id': self.id, 'restaurant_name': self.restaurant_name,
               'voucher_code': self.voucher_code,
               'discount': self.discount,
               'start_time': self.start_time,
               'start_date': self.start_date, 'end_time': self.end_time, 'week_day': self.week_day,
               'repeat_type': self.repeat_type, 'amount': self.amount}
        return res

    def __str__(self):
        return "{}{}{}".format(self.id, self.restaurant_name, self.voucher_code)

    class Meta:
        verbose_name = "voucher"
        verbose_name_plural = verbose_name


class BookVoucher(models.Model):
    verify_code = models.CharField(max_length=50, verbose_name='verify_code')
    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE, verbose_name='voucher', related_name='BookVoucher')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user')
    reservation_name = models.CharField(verbose_name='reservation_name', max_length=50, blank=False)
    email = models.CharField(verbose_name='email', max_length=50, blank=False)
    phone = models.IntegerField(verbose_name='phone', blank=False)
    person_num = models.IntegerField(verbose_name='person_num', blank=False)
    requirements = models.CharField(verbose_name='requirements', max_length=500, blank=True, null=True)

    create_time = models.DateTimeField(verbose_name='create_time', auto_now_add=True)
    tag = models.CharField(max_length=1, default="1")
    objects = models.Manager()

    @property
    def valid_voucher(self):
        res = {'id': self.id, 'verify_code': self.verify_code,
               'restaurant_name': self.voucher.restaurant_name, 'voucher_code': self.voucher.voucher_code,
               'discount': self.voucher.discount,
               'start_date': self.voucher.start_date,
               'start_time': self.voucher.start_time,
               'end_time': self.voucher.end_time,

               'book_date': datetime.datetime.strftime(self.create_time, '%Y-%m-%d %H:%M:%S')

               }

        return res

    @property
    def past_voucher(self):
        res = {'id': self.id, 'voucher_code': self.voucher.voucher_code,
               'restaurant_name': self.voucher.restaurant_name,
               'verify_code': self.verify_code, 'verify_date': self.tag}

        return res

    def __str__(self):
        return "{}{}{}".format(self.id, self.user, self.voucher)

    class Meta:
        verbose_name = "bookVoucher"
        verbose_name_plural = verbose_name


class Comment(models.Model):
    diner = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurant_comment')
    comment = models.CharField(max_length=500)

    food = models.FloatField()
    service = models.FloatField()

    create_time = models.DateTimeField(verbose_name='create_time', auto_now_add=True)
    tag = models.CharField(max_length=1, default="1")
    objects = models.Manager()

    @property
    def stars(self):
        return round((self.food + self.service) / 2, 1)

    def __str__(self):
        return "{}{}{}".format(self.id, self.diner, self.restaurant)

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = verbose_name


class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriber')
    restaurant = models.ForeignKey(User, on_delete=models.CASCADE)

    create_time = models.DateTimeField(verbose_name='create_time', auto_now_add=True)
    tag = models.CharField(max_length=1, default="1")

    def __str__(self):
        return "{}{}{}".format(self.id, self.user, self.restaurant)

    class Meta:
        verbose_name = "Subscription"
        verbose_name_plural = verbose_name
