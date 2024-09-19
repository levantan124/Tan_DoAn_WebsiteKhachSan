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

from .form import PaymentForm
from .vnpay import vnpay


class PaymentViewSet(viewsets.ViewSet):
    def list(self, request):
        return render(request, "index.html", {"title": "Danh sách demo"})

    @action(detail=False, methods=['post'])
    def create_payment(self, request):
        form = PaymentForm(request.data)
        if form.is_valid():
            order_type = form.cleaned_data['order_type']
            order_id = form.cleaned_data['order_id']
            amount = form.cleaned_data['amount']
            order_desc = form.cleaned_data['order_desc']
            bank_code = form.cleaned_data['bank_code']
            language = form.cleaned_data['language']
            ipaddr = get_client_ip(request)

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
            vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)

            return Response({vnpay_payment_url}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Form input not validate"}, status=400)

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


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def generate_random_request_id():
    n = random.randint(10 ** 11, 10 ** 12 - 1)
    n_str = str(n)
    while len(n_str) < 12:
        n_str = '0' + n_str
    return n_str