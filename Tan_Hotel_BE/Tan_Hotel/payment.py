from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from django.shortcuts import render, redirect
from django.http import JsonResponse
from datetime import datetime
from rest_framework import status
import hashlib
import hmac
import random
import requests
from .models import Bill
from .form import PaymentForm
from .vnpay import vnpay
from .serializers import Tan_BillCreateSerializer


class PaymentViewSet(viewsets.ViewSet):
    def list(self, request):
        return render(request, "index.html", {"title": "Danh sách demo"})

    @action(detail=False, methods=['post'])
    def create_payment(self, request):
        form = PaymentForm(request.data)

        if not request.data.get('reservation'):
            return Response({"error": "Missing booking_id"}, status=status.HTTP_400_BAD_REQUEST)

        if form.is_valid():

            order_type = form.cleaned_data['order_type']
            order_id = form.cleaned_data['order_id']
            amount = form.cleaned_data['amount']
            order_desc = form.cleaned_data['order_desc']
            bank_code = form.cleaned_data['bank_code']
            language = form.cleaned_data['language']
            ipaddr = get_client_ip(request)
            reservation = form.cleaned_data['reservation']

            vnp = vnpay()
            vnp.requestData['vnp_Version'] = '2.1.0'
            vnp.requestData['vnp_Command'] = 'pay'
            vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
            vnp.requestData['vnp_Amount'] = amount * 100
            vnp.requestData['vnp_CurrCode'] = 'VND'
            vnp.requestData['vnp_TxnRef'] = order_id
            vnp.requestData['vnp_OrderInfo'] = order_desc
            vnp.requestData['vnp_OrderType'] = order_type
            vnp.requestData['vnp_Locale'] = language if language else 'vn'
            if bank_code:
                vnp.requestData['vnp_BankCode'] = bank_code

            vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')
            vnp.requestData['vnp_IpAddr'] = ipaddr
            vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
                # vnp.requestData['vnp_ReturnUrl'] = 'https://tanhotel391.vercel.app/payment-return'

            # vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
            vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)

            invoice_data = {
                'reservation': reservation,
                'order_id': order_id,
                'amount': amount,
                'description': order_desc,
                'payment_method': 'VNPay',
                'bank_code': bank_code,
                'status': 'pending',
                'vnp_response_code': request.data.get('vnp_ResponseCode'),
            }

            invoice_serializer = Tan_BillCreateSerializer(data=invoice_data)
            if invoice_serializer.is_valid():
                invoice_serializer.save()

                return Response({'payment_url': vnpay_payment_url}, status=status.HTTP_200_OK)
            else:
                return Response(invoice_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "Form input not valid"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def payment_ipn(self, request):
        inputData = request.GET
        if inputData:
            vnp = vnpay()
            vnp.responseData = inputData.dict()
            if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
                # Process the payment response
                result = JsonResponse({'RspCode': '00', 'Message': 'Confirm Success'})
            else:
                result = JsonResponse({'RspCode': '97', 'Message': 'Invalid Signature'})
        else:
            result = JsonResponse({'RspCode': '99', 'Message': 'Invalid request'})
        return result

    @action(detail=False, methods=['get'])
    def payment_return(self, request):
        inputData = request.GET
        if inputData:
            vnp = vnpay()
            vnp.responseData = inputData.dict()
            if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
                if inputData.get('vnp_ResponseCode') == "00":
                    # Payment was successful
                    return Response({
                        "title": "Kết quả thanh toán",
                        "result": "Thành công",
                        **inputData
                    }, status=status.HTTP_200_OK)
                else:
                    # Payment failed
                    return Response({
                        "title": "Kết quả thanh toán",
                        "result": "Lỗi",
                        **inputData
                    }, status=status.HTTP_200_OK)
            else:
                # Checksum validation failed
                return Response({
                    "title": "Kết quả thanh toán",
                    "result": "Lỗi",
                    "msg": "Sai checksum",
                    **inputData
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # No data received in the request
            return Response({
                "title": "Kết quả thanh toán",
                "result": ""
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def get_all_payments(self, request):
        # Lấy tất cả các bản ghi từ model Bill
        bills = Bill.objects.all()
        # Serialize dữ liệu hóa đơn
        bills_data = []
        for bill in bills:
            # Serialize thông tin hóa đơn
            bill_serializer = Tan_BillCreateSerializer(bill)

            # Lấy thông tin reservation từ hóa đơn
            reservation = bill.reservation  # Giả sử Bill có trường reservation là ForeignKey
            if reservation:
                # Lấy thông tin chi tiết từ reservation
                reservation_info = {
                    'id': reservation.id,
                    'guest_name': reservation.guest.name,  # Lấy tên khách từ tài khoản
                    'room_names': ", ".join(reservation.room.values_list('name', flat=True)),  # Lấy tên phòng
                    'book_date': reservation.book_date,
                    'checkin': reservation.checkin,
                    'checkout': reservation.checkout,
                    'status_checkin': reservation.status_checkin,
                    'check_in_date': reservation.check_in_date,
                }
            else:
                reservation_info = None

            # Thêm dữ liệu hóa đơn và thông tin reservation vào danh sách
            bills_data.append({
                'bill_info': bill_serializer.data,
                'reservation_info': reservation_info,
            })

        # Trả về phản hồi
        return Response(bills_data, status=status.HTTP_200_OK)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def generate_random_request_id():
    n = random.randint(10**11, 10**12 - 1)
    n_str = str(n)
    while len(n_str) < 12:
        n_str = '0' + n_str
    return n_str




# from rest_framework import viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from django.conf import settings
# from django.shortcuts import render, redirect
# from django.http import JsonResponse
# from datetime import datetime
# from rest_framework import status
# import hashlib
# import hmac
# import random
# import requests
# from .models import Bill, LoyaltyPoint
# from .form import PaymentForm
# from .vnpay import vnpay
# from .serializers import Tan_BillCreateSerializer
#
#
# class PaymentViewSet(viewsets.ViewSet):
#     def list(self, request):
#         return render(request, "index.html", {"title": "Danh sách demo"})
#
#     @action(detail=False, methods=['post'])
#     def create_payment(self, request):
#         form = PaymentForm(request.data)
#
#         if not request.data.get('reservation'):
#             return Response({"error": "Missing booking_id"}, status=status.HTTP_400_BAD_REQUEST)
#
#         if form.is_valid():
#             order_type = form.cleaned_data['order_type']
#             order_id = form.cleaned_data['order_id']
#             amount = form.cleaned_data['amount']
#             order_desc = form.cleaned_data['order_desc']
#             bank_code = form.cleaned_data['bank_code']
#             language = form.cleaned_data['language']
#             ipaddr = get_client_ip(request)
#             reservation = form.cleaned_data['reservation']
#
#             # Check for points to be applied and update amount accordingly (UPDATED)
#             points_to_redeem = request.data.get('points_to_redeem', 0)
#             guest = reservation.guest  # Assuming reservation has a guest field
#             loyalty_account = LoyaltyPoint.objects.get(guest=guest)
#
#             if points_to_redeem > 0 and points_to_redeem <= loyalty_account.points:
#                 discount = points_to_redeem / 1000  # Example: 1000 points = 1000 VND
#                 amount = amount - discount if amount > discount else 0  # Apply points discount
#                 loyalty_account.redeem_points(points_to_redeem)
#
#             vnp = vnpay()
#             vnp.requestData['vnp_Version'] = '2.1.0'
#             vnp.requestData['vnp_Command'] = 'pay'
#             vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
#             vnp.requestData['vnp_Amount'] = amount * 100  # Amount in VND
#             vnp.requestData['vnp_CurrCode'] = 'VND'
#             vnp.requestData['vnp_TxnRef'] = order_id
#             vnp.requestData['vnp_OrderInfo'] = order_desc
#             vnp.requestData['vnp_OrderType'] = order_type
#             vnp.requestData['vnp_Locale'] = language if language else 'vn'
#             if bank_code:
#                 vnp.requestData['vnp_BankCode'] = bank_code
#
#             vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')
#             vnp.requestData['vnp_IpAddr'] = ipaddr
#             if 'localhost' in request.build_absolute_uri():
#                 vnp.requestData['vnp_ReturnUrl'] = 'http://localhost:3000/payment-return'
#             else:
#                 vnp.requestData['vnp_ReturnUrl'] = 'https://tanhotel391.vercel.app/payment-return'
#
#             vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)
#
#             invoice_data = {
#                 'reservation': reservation,
#                 'order_id': order_id,
#                 'amount': amount,
#                 'description': order_desc,
#                 'payment_method': 'VNPay',
#                 'bank_code': bank_code,
#                 'status': 'pending',
#                 'vnp_response_code': request.data.get('vnp_ResponseCode'),
#                 'points_used': points_to_redeem  # Record points used (UPDATED)
#             }
#
#             invoice_serializer = Tan_BillCreateSerializer(data=invoice_data)
#             if invoice_serializer.is_valid():
#                 invoice_serializer.save()
#
#                 # Accumulate points after payment (UPDATED)
#                 loyalty_account.accumulate_points(amount)
#
#                 return Response({'payment_url': vnpay_payment_url}, status=status.HTTP_200_OK)
#             else:
#                 return Response(invoice_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#         return Response({"error": "Form input not valid"}, status=status.HTTP_400_BAD_REQUEST)
#
#     @action(detail=False, methods=['get'])
#     def payment_ipn(self, request):
#         inputData = request.GET
#         if inputData:
#             vnp = vnpay()
#             vnp.responseData = inputData.dict()
#             if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
#                 # Process the payment response
#                 result = JsonResponse({'RspCode': '00', 'Message': 'Confirm Success'})
#             else:
#                 result = JsonResponse({'RspCode': '97', 'Message': 'Invalid Signature'})
#         else:
#             result = JsonResponse({'RspCode': '99', 'Message': 'Invalid request'})
#         return result
#
#     @action(detail=False, methods=['get'])
#     def payment_return(self, request):
#         inputData = request.GET
#         if inputData:
#             vnp = vnpay()
#             vnp.responseData = inputData.dict()
#             if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
#                 if inputData.get('vnp_ResponseCode') == "00":
#                     # Payment was successful
#                     return Response({
#                         "title": "Kết quả thanh toán",
#                         "result": "Thành công",
#                         **inputData
#                     }, status=status.HTTP_200_OK)
#                 else:
#                     # Payment failed
#                     return Response({
#                         "title": "Kết quả thanh toán",
#                         "result": "Lỗi",
#                         **inputData
#                     }, status=status.HTTP_200_OK)
#             else:
#                 # Checksum validation failed
#                 return Response({
#                     "title": "Kết quả thanh toán",
#                     "result": "Lỗi",
#                     "msg": "Sai checksum",
#                     **inputData
#                 }, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             # No data received in the request
#             return Response({
#                 "title": "Kết quả thanh toán",
#                 "result": ""
#             }, status=status.HTTP_400_BAD_REQUEST)
#
#
# def get_client_ip(request):
#     x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#     if x_forwarded_for:
#         ip = x_forwarded_for.split(',')[0]
#     else:
#         ip = request.META.get('REMOTE_ADDR')
#     return ip
#
#
# def generate_random_request_id():
#     n = random.randint(10 ** 11, 10 ** 12 - 1)
#     n_str = str(n)
#     while len(n_str) < 12:
#         n_str = '0' + n_str
#     return n_str
