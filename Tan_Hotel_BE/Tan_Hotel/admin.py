from django.contrib import admin
from .models import *


# Inline admin cho ReservationService, hien thi trong trang quan tri cua Reservation
class Tan_ReservationServiceInline(admin.TabularInline):
    model = ReservationService
    extra = 1  # So luong mau dich vu them mac dinh

# Tuy chinh trang quan tri cho Reservation
class Tan_ReservationAdmin(admin.ModelAdmin):
    inlines = [Tan_ReservationServiceInline]  # Hien thi ReservationService trong Reservation
    list_display = ('guest', 'book_date', 'checkin', 'checkout', 'status_checkin')  # Cac truong hien thi trong danh sach
    search_fields = ('guest__name', 'room__name')  # Tim kiem theo ten khach va ten phong

# Tuy chinh trang quan tri cho Bill
class Tan_BillAdmin(admin.ModelAdmin):
    list_display = ('reservation', 'total_amount')  # Cac truong hien thi trong danh sach
    search_fields = ('reservation__guest__name',)  # Tim kiem theo ten khach trong Bill

#Giao dien Admin
class Tan_CustomAdminSite(admin.AdminSite):
    site_header = 'TanHotel Admin'

    class Media:
        css = {
            'all': ('/static/css/style.css',)
        }
class Tan_RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1

class Tan_RoomAdmin(admin.ModelAdmin):
    inlines = [Tan_RoomImageInline]




# Dang ky cac model voi trang quan tri Django
admin.site.register(Account)  # Dang ky Account model
admin.site.register(Refund)  # Dang ky Refund model
admin.site.register(Bill, Tan_BillAdmin)  # Dang ky Bill model voi tuy chinh BillAdmin
admin.site.register(RoomType)  # Dang ky RoomType model
admin.site.register(Room, Tan_RoomAdmin)  # Dang ky Room model
admin.site.register(RoomImage) # Dang ky RoomImage model
admin.site.register(Reservation, Tan_ReservationAdmin)  # Dang ky Reservation model voi tuy chinh ReservationAdmin
admin.site.register(ReservationService)  # Dang ky ReservationService model
admin.site.register(Service)  # Dang ky Service model
admin.site.register(Promotion)  # Dang ky Promotion model
admin.site.register(Feedback)  # Dang ky Feedback model
admin.site.register(Payment)  # Dang ky Payment model



