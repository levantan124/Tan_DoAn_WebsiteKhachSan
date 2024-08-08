from rest_framework import serializers, status
from rest_framework.response import Response
from .models import (
    Account, RoomType, Room, Service, Reservation,
    ReservationService, Bill, Refund, Payment, Feedback, Promotion, RoomImage
)


# Serializer cho Account
class Tan_AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'password', 'name', 'avatar', 'DOB', 'address', 'phone', 'email', 'sex', 'role',
                  'is_active']
        extra_kwargs = {'password': {'write_only': True}}

        def create(self, validated_data):
            user = Account(
                username=validated_data['username'],
                name=validated_data['name'],
                avatar=validated_data.get('avatar'),
                DOB=validated_data.get('DOB'),
                Address=validated_data.get('address'),
                phone=validated_data.get('phone'),
                email=validated_data.get('email'),
                sex=validated_data.get('sex'),
                role=validated_data.get('role'),
            )
            user.set_password(validated_data['password'])
            user.save()
            return user

        def to_representation(self, instance):
            representation = super().to_representation(instance)
            # Kiểm tra xem avatar có phải là None không trước khi cố gắng truy cập thuộc tính url
            if instance.avatar:
                representation['avatar'] = instance.avatar.url
            else:
                representation['avatar'] = None
            return representation


# Serializer cho RoomType
class Tan_RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'name', 'price', 'quantity', 'active']


# Serializer cho Room
class Tan_RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'room_type', 'status', 'image','active']


class Tan_RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = '__all__'

# Serializer cho Service
class Tan_ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'active']



# Serializer cho Reservation
class Tan_ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'


# Serializer cho ReservationService
class Tan_ReservationServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationService
        fields = '__all__'


# Serializer cho Bill
class Tan_BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'


# Serializer cho Refund
class Tan_RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = '__all__'


# Serializer cho Payment
class Tan_PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


# Serializer cho Feedback
class Tan_FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


# Serializer cho Promotion
class Tan_PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'
