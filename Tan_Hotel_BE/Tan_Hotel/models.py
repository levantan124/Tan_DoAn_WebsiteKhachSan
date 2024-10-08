from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField


class BaseModel(models.Model):
    created_date = models.DateTimeField(default=timezone.now, editable=False)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Account(AbstractUser):
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    name = models.CharField(max_length=100)
    avatar = CloudinaryField(null=True, blank=True)
    DOB = models.DateField(null=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(max_length=200, unique=True, null=True, blank=True)

    class Sex(models.IntegerChoices):
        NAM = 1, 'Nam'
        NU = 2, 'Nữ'

    sex = models.IntegerField(choices=Sex.choices, null=True, default=Sex.NAM)

    class Roles(models.IntegerChoices):
        ADMIN = 1, 'Admin'
        LETAN = 2, 'Lễ tân'
        KHACHHANG = 3, 'Khách hàng'

    role = models.IntegerField(choices=Roles.choices, null=True, default=Roles.KHACHHANG)

    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.username


class RoomType(BaseModel):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Room(BaseModel):
    name = models.CharField(max_length=100)
    image = CloudinaryField('image', null=True, blank=True)  # Hình ảnh chính của phòng
    room_type = models.ForeignKey('RoomType', on_delete=models.CASCADE)

    class Status(models.IntegerChoices):
        TRONG = 0, 'Trống'
        CONGUOI = 1, 'Có người'

    status = models.IntegerField(choices=Status.choices, default=Status.TRONG)

    def __str__(self):
        return self.name

class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image1 = CloudinaryField()
    image2 = CloudinaryField()
    image3 = CloudinaryField()
    image4 = CloudinaryField()
    image4 = CloudinaryField()

    def __str__(self):
        return f'Image for {self.room.name}'

class Service(BaseModel):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Reservation(BaseModel):
    guest = models.ForeignKey(Account, on_delete=models.CASCADE, limit_choices_to={'role': Account.Roles.KHACHHANG})
    room = models.ManyToManyField(Room, related_name='reservations')
    services = models.ManyToManyField(Service, through='ReservationService')
    book_date = models.DateTimeField()
    checkin = models.DateTimeField()
    checkout = models.DateTimeField()
    check_in_date = models.DateTimeField(null=True, blank=True)
    status_checkin = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.status_checkin and not self.check_in_date:
            self.check_in_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        room_names = ", ".join(self.room.values_list('name', flat=True))
        return f"{room_names} - Guest: {self.guest.name}"


class ReservationService(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.service.name} - Reservation: {self.reservation.guest.name}"


class Bill(BaseModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    reservation = models.ForeignKey(Reservation, null=True, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    description = models.TextField(null=True, blank = True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # Payment status

    def calculate_total_amount(self):
        total_services_cost = sum(rs.total_price for rs in self.reservation.reservationservice_set.all())
        total_days = (self.reservation.checkout - self.reservation.checkin).days
        room_price = sum(room.room_type.price for room in self.reservation.room.all())
        total_room_cost = total_days * room_price
        self.total_amount = total_services_cost + total_room_cost

    def save(self, *args, **kwargs):
        self.calculate_total_amount()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reservation.guest.email} - {self.total_amount}"


class Refund(models.Model):
    guest = models.ForeignKey(Account, null=True, on_delete=models.CASCADE, limit_choices_to={'role': Account.Roles.KHACHHANG})
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    reason = models.TextField()

    def __str__(self):
        return str(self.guest)


class Payment(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(default=timezone.now)
    payment_method = models.CharField(max_length=50)

    def __str__(self):
        return f"Payment of {self.amount} for {self.reservation}"


class Feedback(models.Model):
    guest = models.ForeignKey(Account, on_delete=models.CASCADE, limit_choices_to={'role': Account.Roles.KHACHHANG})
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=1, choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Feedback from {self.guest.name}"


class Promotion(BaseModel):
    title = models.CharField(max_length=200)  # Tiêu đề của chương trình khuyến mãi
    description = models.TextField()  # Mô tả chi tiết về khuyến mãi
    code = models.CharField(max_length=50, unique=True, null=True)  # Mã khuyến mãi
    discount = models.IntegerField(null=True, help_text="Discount value percentage")
    start_date = models.DateTimeField()  # Ngày bắt đầu khuyến mãi
    end_date = models.DateTimeField()  # Ngày kết thúc khuyến mãi
    max_redemptions = models.IntegerField(default=100, null=True)  # Số lần khuyến mãi có thể sử dụng
    active = models.BooleanField(default=True, null=True)  # Trạng thái khuyến mãi
    usage_count = models.IntegerField(default=0, null=True)  # Số lần khuyến mãi đã được sử dụng

    def __str__(self):
        return self.title

    def is_valid(self):
        """Check if promotion is valid based on date and active status."""
        now = timezone.now()
        return self.active and self.start_date <= now <= self.end_date