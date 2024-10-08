from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import *
from .payment import PaymentViewSet

# Khai báo router và đăng ký các viewsets
router = DefaultRouter()
router.register(r'accounts', views.Tan_AccountViewSet, basename='accounts')
router.register(r'roomtypes', views.Tan_RoomTypeViewSet, basename='roomtype')
router.register(r'rooms', views.Tan_RoomViewSet, basename='room')
router.register(r'room-images', Tan_RoomImageViewSet, basename='roomimage')
router.register(r'reservations', views.Tan_ReservationViewSet, basename='reservation')
router.register(r'sendemail', views.SendEmailViewSet, basename='sendemail')
router.register(r'services', views.Tan_ServiceViewSet, basename='service')
router.register(r'reservation_services', views.Tan_ReservationServiceViewSet, basename='reservation_services')
router.register(r'bills', views.Tan_BillViewSet, basename='bill')
router.register(r'refunds', views.Tan_RefundViewSet, basename='refund')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'feedbacks', views.Tan_FeedbackViewSet, basename='feedback')
router.register(r'promotions', views.Tan_PromotionViewSet, basename='promotion')


# Khai báo các URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path(
        "google/callback/login",
        views.GoogleOAuth2LoginCallbackView.as_view(),
        name="google_login_callback",
    ),
    # path('reservations/<int:reservation_id>/services/', Tan_ReservationServiceListView.as_view(), name='reservation-services'),
]