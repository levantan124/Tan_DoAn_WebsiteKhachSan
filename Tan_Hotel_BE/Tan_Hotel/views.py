# views.py
import time
from datetime import datetime

import requests
from django.contrib.auth.models import AnonymousUser
from oauth2_provider.settings import oauth2_settings
from rest_framework import viewsets, generics, parsers, permissions, exceptions, status, serializers
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import PermissionDenied
from google.oauth2 import id_token
from google.auth.transport import requests as gg_requests
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


from .serializers import (
    Tan_AccountSerializer, Tan_RoomTypeSerializer, Tan_RoomSerializer, Tan_RoomImageSerializer, Tan_ServiceSerializer,
    Tan_ReservationSerializer, Tan_ReservationServiceSerializer, Tan_BillSerializer,
    Tan_RefundSerializer, Tan_PaymentSerializer, Tan_FeedbackSerializer, Tan_PromotionSerializer
)
from rest_framework.response import Response


from . import perm, utils

from .models import (
    Account, RoomType, Room, Service, Reservation,
    ReservationService, Bill, Refund, Payment, Feedback, Promotion, RoomImage
)


class Tan_AccountViewSet(viewsets.ViewSet, generics.CreateAPIView,generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Account.objects.filter(is_active=True).all()
    serializer_class = Tan_AccountSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]  # upload được hình ảnh và làm việc với json
    permission_classes = [permissions.AllowAny()]  # role nào vô cùng đc

    def get_permissions(self):
        if self.action in ['list', 'get_current_user', 'partial_update', 'account_is_valid', 'google_login', 'verify-captcha']:
            # permission_classes = [IsAuthenticated]
            return [permissions.AllowAny()]
        elif self.action == 'create':
            print(f"self.action: {self.action}")
            if isinstance(self.request.user, AnonymousUser):
                if self.request.data and (self.request.data.get('role') == 3):
                    return [permissions.AllowAny()]
                else:
                    return [permissions.IsAuthenticated()]
            elif self.request.data and self.request.data.get('role') == 2:
                if self.request.user.role in [Account.Roles.ADMIN.value]:
                    return [permissions.IsAuthenticated()]
                else:
                    raise exceptions.PermissionDenied()
            elif self.request.data and self.request.data.get('role') == 1:
                if self.request.user.role == Account.Roles.ADMIN.value:
                    return [permissions.IsAuthenticated()]
                else:
                    raise exceptions.PermissionDenied()
            elif self.action == 'delete_staff':
                return [perm.Tan_IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Account.objects.filter(is_active=True)

    # API xem chi tiet + cap nhat tai khoan
    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user

        # Kiểm tra xem người dùng có phải là AnonymousUser không
        if isinstance(user, AnonymousUser):
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'PATCH':
            # Cập nhật thông tin người dùng
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()
            return Response(Tan_AccountSerializer(user).data)

        # Trả về thông tin người dùng cho phương thức GET
        return Response(Tan_AccountSerializer(user).data)

    # API vo hieu hoa tai khoan
    @action(detail=True, methods=['patch'], url_path='delete-staff')
    def delete_staff(self, request, pk=None):
        user = Account.objects.get(pk=pk)
        user.is_active = False
        user.save()
        return Response({"Thông báo": "Vô hiệu hoá tài khoản thành công."}, status=status.HTTP_204_NO_CONTENT)

    #xet xem email co ton tai khong khi dang ki
    @action(methods=['get'], url_path='account-is-valid', detail=False)
    def account_is_valid(self, request):
        email = self.request.query_params.get('email')

        if email:
            tk = Account.objects.filter(email=email)
            if tk.exists():
                return Response(data={'is_valid': "True", 'message': 'Email đã tồn tại'}, status=status.HTTP_200_OK)

        return Response(data={'is_valid': "False"}, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='google-login', detail=False)
    def google_login(self, request):
        id_token_from_client = request.data.get('id_token')
        if not id_token_from_client:
            return Response({'error': 'Mã xác thực không được cung cấp'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(id_token_from_client, gg_requests.Request())

            user_email = idinfo.get('email')
            user_name = idinfo.get('name')
            user_picture = idinfo.get('picture')

            if not user_email:
                return Response({'error': 'Không tìm thấy email trong mã xác thực'}, status=status.HTTP_400_BAD_REQUEST)

            user, created = Account.objects.get_or_create(
                username=user_email,
                defaults={'name': user_name, 'email': user_email,
                          'avatar': utils.upload_image_from_url(user_picture)})

            access_token, refresh_token = utils.create_user_token(user=user)

            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': user.name,
                },
                'created': created,
                'token': {
                    'access_token': access_token.token,
                    'expires_in': 36000,
                    'refresh_token': refresh_token.token,
                    'token_type': 'Bearer',
                    'scope': access_token.scope,
                }
            })
        except ValueError as e:
            print(e)
            return Response({'error': 'Xác thực không thành công', 'details': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='verify-captcha', detail=False)
    def verify_captcha(self, request):
        captcha_response = request.data.get('g-recaptcha-response')
        if not captcha_response:
            return Response({'error': 'Mã xác thực CAPTCHA không được cung cấp'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'secret': settings.RECAPTCHA_SECRET_KEY,
            'response': captcha_response
        }
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result = response.json()

        if result.get("success"):
            return Response({'success': True}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Xác thực CAPTCHA không thành công'}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from .models import RoomType

class Tan_RoomTypeViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = RoomType.objects.all()
    serializer_class = Tan_RoomTypeSerializer

    def get_permissions(self):
        if self.action in ['list', 'create', 'retrieve', 'partial_update', 'destroy']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return RoomType.objects.filter(active=True).all()

    def partial_update(self, request, pk=None):
        # Cập nhật một RoomType cụ thể
        try:
            roomType = RoomType.objects.get(pk=pk)
        except RoomType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(roomType, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        # Tạo mới RoomType
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        # Lấy thông tin chi tiết của một RoomType cụ thể
        try:
            roomType = RoomType.objects.get(pk=pk)
        except RoomType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(roomType)
        return Response(serializer.data)

class Tan_RoomViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Room.objects.filter(active=True)
    serializer_class = Tan_RoomSerializer

    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy', 'delete_room', 'retrieve', 'reservations']:
            return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        try:
            # Lấy dữ liệu từ request
            room_type_id = request.data.get("room_type")
            name_room = request.data.get("name")
            image_room = request.data.get("image")

            # Kiểm tra dữ liệu đầu vào
            if not room_type_id or not name_room:
                return Response(
                    {"detail": "RoomType and name are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Lấy RoomType từ cơ sở dữ liệu
            room_type = RoomType.objects.get(id=room_type_id)

            # Tạo phòng mới
            new_room = Room.objects.create(name=name_room, room_type=room_type, image=image_room)

            # Trả về phản hồi thành công
            return Response(
                Tan_RoomSerializer(new_room).data,
                status=status.HTTP_201_CREATED
            )
        except RoomType.DoesNotExist:
            return Response(
                {"detail": "RoomType not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(active=True)
        serializer = Tan_RoomSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return self.queryset

    def partial_update(self, request, pk=None):
        try:
            room = self.get_object()
        except Room.DoesNotExist:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='delete-room')
    def delete_room(self, request, pk=None):
        try:
            room = self.get_object()
            if room is None:
                return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

            # Thực hiện vô hiệu hóa (disable) room
            room.active = False
            room.save()

            return Response({"detail": "Room has been deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def reservations(self, request, pk=None):
        room = self.get_object()
        reservations = Reservation.objects.filter(room=room)
        serializer = Tan_ReservationSerializer(reservations, many=True)
        return Response(serializer.data)

class Tan_RoomImageViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = RoomImage.objects.all()
    serializer_class = Tan_RoomImageSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'partial_update', 'create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        room_id = request.query_params.get('room_id')
        if not room_id:
            return Response({'detail': 'room_id parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        room_images = RoomImage.objects.filter(room_id=room_id)
        serializer = self.get_serializer(room_images, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):

        pk = self.kwargs.get('pk')
        try:
            room_image = self.queryset.get(pk=pk)
        except RoomImage.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(room_image)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        try:
            room_image = self.queryset.get(pk=pk)
        except RoomImage.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(room_image, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class Tan_ServiceViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Service.objects.filter(active=True)
    serializer_class = Tan_ServiceSerializer

    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            if not (perm.Tan_IsAdmin()):  # Chỉ admin mới có quyền
                raise PermissionDenied("Only admin can perform this action.")
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Service.objects.filter(active=True)

    def partial_update(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='delete-service')
    def delete_service(self, request, pk=None):
        service = self.get_object()

        # Thực hiện vô hiệu hóa
        service.active = False
        service.save()

        return Response({"detail": "Service has been cancelled successfully."}, status=status.HTTP_204_NO_CONTENT)


from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Reservation
from .serializers import Tan_ReservationSerializer

class Tan_ReservationViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Reservation.objects.filter(active=True)
    serializer_class = Tan_ReservationSerializer

    def get_permissions(self):
        # Phân quyền theo action
        if self.action in ['list']:
            if self.request.user.is_authenticated and self.request.user.role == Account.Roles.LETAN:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only receptionists can access this endpoint.")
        elif self.action in ['partial_update', 'update']:
            if self.request.user.is_authenticated and self.request.user.role in [Account.Roles.KHACHHANG, Account.Roles.LETAN]:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only the customer or receptionists can partially update this reservation.")
        elif self.action == 'get_reservation_guest':
            return [permissions.IsAuthenticated(), perm.Tan_IsKhachHang()]
        elif self.action == 'cancel_reservation':
            if self.request.user.is_authenticated and self.request.user.role == Account.Roles.LETAN:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only receptionists can cancel reservations.")
        elif self.action == 'get_reservation_history':
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        # Lấy queryset theo điều kiện
        return self.queryset

    def list(self, request, *args, **kwargs):
        # Lấy danh sách reservation
        queryset = self.get_queryset().filter(active=True)
        serializer = Tan_ReservationSerializer(queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        # Cập nhật một reservation
        pk = kwargs.get('pk')
        try:
            reservation = self.queryset.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response({'detail': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in [Account.Roles.KHACHHANG, Account.Roles.LETAN, Account.Roles.ADMIN]:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(reservation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Cập nhật phòng nếu có room_id trong request data
        room_id = request.data.get('room')
        if room_id:
            try:
                room = Room.objects.get(id=room_id)
                reservation.room.set([room])
            except Room.DoesNotExist:
                return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        self.perform_update(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def perform_update(self, serializer):
        # Lưu dữ liệu sau khi cập nhật
        serializer.save()

    def create(self, request, *args, **kwargs):
        # Tạo mới reservation
        guest = request.user
        room_id = request.data.get('room')

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Kiểm tra trạng thái của phòng
        if room.status != 0:
            return Response({'detail': 'Room is not available.'}, status=status.HTTP_400_BAD_REQUEST)

        reservation = Reservation.objects.create(
            guest=guest,
            book_date=request.data.get('book_date'),
            checkin=request.data.get('checkin'),
            checkout=request.data.get('checkout'),
            active=True
        )
        reservation.room.add(room)
        reservation.save()

        # Cập nhật trạng thái phòng
        room.status = 1
        room.save()

        return Response(Tan_ReservationSerializer(reservation).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='deactivate')
    def deactivate_reservation(self, request, pk=None):
        # Vô hiệu hóa reservation
        try:
            reservation = self.get_object()
            if request.user.is_authenticated and request.user.role == Account.Roles.LETAN:
                reservation.active = False
                reservation.save()
                return Response({'status': 'reservation deactivated'}, status=status.HTTP_200_OK)
            else:
                raise PermissionDenied("Only receptionists can deactivate reservations.")
        except Reservation.DoesNotExist:
            return Response({'error': 'Reservation not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'], url_path='current-reservation')
    def patch_current_reservation(self, request, pk=None):
        # Cập nhật reservation hiện tại
        reservation = self.get_object()

        guest_username = self.request.data.get('guest')

        try:
            guest = Account.objects.get(username=guest_username)
        except Account.DoesNotExist:
            return Response({"detail": "Guest not found."}, status=status.HTTP_404_NOT_FOUND)
        except Account.MultipleObjectsReturned:
            return Response({"detail": "Multiple accounts found with this username."},
                            status=status.HTTP_400_BAD_REQUEST)

        reservation.guest = guest

        for k, v in request.data.items():
            if k == 'room':
                rooms_data = v
                rooms = []
                for room_data in rooms_data:
                    room_type_name = room_data.pop('room_type')

                    try:
                        room_type = RoomType.objects.get(name=room_type_name)
                        room_data['room_type'] = room_type
                    except RoomType.DoesNotExist:
                        return Response({"detail": f"RoomType '{room_type_name}' not found."},
                                        status=status.HTTP_404_NOT_FOUND)

                    room, created = Room.objects.get_or_create(**room_data)
                    rooms.append(room)

                reservation.room.set(rooms)
            elif k != 'guest':
                setattr(reservation, k, v)

        reservation.save()

        return Response(Tan_ReservationSerializer(reservation).data)

    @action(detail=True, methods=['patch'], url_path='cancel-reservation')
    def cancel_reservation(self, request, pk=None):
        # Hủy reservation
        reservation = self.get_object()

        reservation.active = False
        reservation.save()

        return Response({"detail": "Reservation has been cancelled successfully."}, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], url_path='rooms', detail=True)
    def get_rooms(self, request, pk):
        # Lấy danh sách phòng theo reservation
        rooms = self.get_object().room.filter(active=True)
        q = request.query_params.get('name')
        if q:
            rooms = rooms.filter(name__icontains=q)

        return Response(Tan_RoomSerializer(rooms, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='get-reservation-guest', detail=False)
    def get_reservation_guest(self, request):
        # Lấy danh sách reservation của guest
        reservations = Reservation.objects.filter(guest=request.user).order_by('-created_date')
        serializer = Tan_ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, url_path='add-service', methods=['post'])
    def add_service(self, request, pk=None):
        # Thêm dịch vụ vào reservation
        reservation = self.get_object()
        service_name = request.data.get('name')
        quantity = request.data.get('quantity', 1)
        service = get_object_or_404(Service, name=service_name)

        reservation_service, created = ReservationService.objects.get_or_create(
            reservation=reservation,
            service=service,
            defaults={'quantity': quantity}
        )
        if not created:
            reservation_service.quantity += quantity
            reservation_service.save()

        return Response({'status': 'service added'})

    @action(detail=True, methods=['post'], url_path='check-in-status')
    def check_in(self, request, pk=None):
        # Lấy giá trị status_checkin từ request data
        status_checkin = request.data.get('status_checkin')

        # Xác nhận rằng giá trị này không rỗng và là một boolean
        if status_checkin is not None and isinstance(status_checkin, bool):
            reservation = Reservation.objects.get(pk=pk)
            reservation.status_checkin = status_checkin
            reservation.save()

            return Response({"detail": "Check-in status updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid status_checkin value."}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='reservation-history', detail=False)
    def get_reservation_history(self, request):
        # Lấy lịch sử đặt phòng của khách hàng
        reservations = Reservation.objects.all().order_by('-book_date')
        serializer = Tan_ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='feedbacks')
    def get_feedbacks(self, request, pk=None):
        try:
            reservation = self.get_object()
            feedbacks = Feedback.objects.filter(reservation=reservation)
            serializer = Tan_FeedbackSerializer(feedbacks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({"detail": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Tan_ReservationServiceViewSet(viewsets.ViewSet, generics.ListCreateAPIView,generics.UpdateAPIView):
    queryset = ReservationService.objects.all()
    serializer_class = Tan_ReservationServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'list', 'update_active']:
            # Chỉ cho phép người dùng có vai trò 'Lễ tân' sử dụng phương thức 'create'
            if not (self.request.user.is_authenticated and
                    self.request.user.role == Account.Roles.LETAN):
                raise PermissionDenied("Only Receptionists can perform this action.")
            return [permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Cũng có thể đặt quyền cho các hành động khác nếu cần
            if not (self.request.user.is_authenticated and
                    self.request.user.role == Account.Roles.ADMIN):
                raise PermissionDenied("Only Admins can perform this action.")
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        reservation_id = request.data.get('reservation')
        service_id = request.data.get('service')
        quantity = int(request.data.get('quantity', 1))

        try:
            reservation = Reservation.objects.get(id=reservation_id)
            service = Service.objects.get(id=service_id)
        except (Reservation.DoesNotExist, Service.DoesNotExist):
            return Response({"detail": "Reservation or Service not found."}, status=status.HTTP_404_NOT_FOUND)

        if not reservation.active:
            return Response({"detail": "Reservation is not active."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = service.price * quantity

        reservation_service = ReservationService.objects.create(
            reservation=reservation,
            service=service,
            quantity=quantity,
            total_price=total_price
        )

        serializer = self.get_serializer(reservation_service)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        # Lọc các reservation đang active
        active_reservations = Reservation.objects.filter(active=True)
        active_services = Service.objects.filter(active=True)
        # Lọc reservation services thuộc các reservation đang active
        queryset = ReservationService.objects.filter(
            active=True,
            reservation__in=active_reservations,
            service__in=active_services
        )

        # Serialize dữ liệu
        serializer = self.get_serializer(queryset, many=True)

        # Trả về phản hồi với dữ liệu đã được serialize
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        try:
            # Lấy đối tượng ReservationService theo id
            instance = self.get_object()
        except ReservationService.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Cập nhật trường active
        active = request.data.get('active', None)

        if active is not None:
            instance.active = active
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'detail': 'Field "active" is required.'}, status=status.HTTP_400_BAD_REQUEST)

class SendEmailViewSet(viewsets.ViewSet):
    def create(self, request):
        subject = request.data.get('subject')
        message = request.data.get('message')
        recipient_list = [request.data.get('recipient')]
        sender = 'vantanss1001ez@gmail.com'

        if not subject or not message or not recipient_list:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(subject, message, sender, recipient_list)
            return Response({'success': True})
        except Exception as e:
            return Response({'error': f'Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Tan_BillViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Bill.objects.all()
    serializer_class = Tan_BillSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'create']:  # Allow 'list' and 'create' for receptionists
            if self.request.user.is_authenticated and self.request.user.role == Account.Roles.LETAN:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only receptionists can access this endpoint.")

        return [permissions.AllowAny()]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = Tan_BillSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data
        total_amount = data.get('total_amount')  # Change to 'total_amount'
        reservation_id = data.get('reservation')

        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create the bill instance with the correct field name
        bill = Bill.objects.create(
            total_amount=total_amount,
            reservation=reservation
        )

        serializer = Tan_BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class Tan_RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = Tan_RefundSerializer

class Tan_PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = Tan_PaymentSerializer

class Tan_FeedbackViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = Tan_FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            # Cho phép tất cả người dùng đã xác thực xem danh sách feedback
            return [permissions.AllowAny()]
        elif self.action == 'create':
            # Cho phép tất cả người dùng đã xác thực tạo feedback mới
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        # Lấy danh sách tất cả feedback
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        # Tạo feedback mới
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # Lưu feedback mới
        serializer.save()

    @action(detail=True, methods=['get'])
    def customer_info(self, request, pk=None):
        try:
            feedback = Feedback.objects.get(pk=pk)
            customer = feedback.guest
            serializer = Tan_AccountSerializer(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Feedback.DoesNotExist:
            return Response({'detail': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)
        except Account.DoesNotExist:
            return Response({'detail': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

class Tan_PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = Tan_PromotionSerializer