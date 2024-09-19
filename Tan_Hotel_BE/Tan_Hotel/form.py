# forms.py
from django import forms

class PaymentForm(forms.Form):
    order_type = forms.CharField(max_length=50)
    order_id = forms.CharField(max_length=50)
    amount = forms.DecimalField(max_digits=10, decimal_places=2)
    order_desc = forms.CharField(max_length=255)
    bank_code = forms.CharField(max_length=50, required=False)
    language = forms.CharField(max_length=2, required=False)
