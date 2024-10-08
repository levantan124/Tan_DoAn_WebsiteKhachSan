#serializers.py
from rest_framework import serializers
from .models import RoomChat
from Tan_Hotel.models import Account
from Tan_Hotel.serializers import Tan_AccountSerializer


class RoomChatSerializer(serializers.ModelSerializer):
    sender = Tan_AccountSerializer()
    receiver = Tan_AccountSerializer()

    class Meta:
        model = RoomChat
        fields = ['id','room_name', 'sender', 'receiver', 'created_at']
