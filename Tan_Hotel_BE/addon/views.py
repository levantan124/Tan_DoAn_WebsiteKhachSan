#views.py
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RoomChat
from .serializers import RoomChatSerializer
from django.db import models

class RoomChatViewSet(viewsets.ViewSet,
                      generics.RetrieveAPIView,
                      generics.ListAPIView):
    queryset = RoomChat.objects.all()
    serializer_class = RoomChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_name = self.request.query_params.get('room_name')
        user = self.request.user  # Get the logged-in receptionist

        if room_name:
            return self.queryset.filter(room_name=room_name).filter(
                models.Q(sender=user) | models.Q(receiver=user)
            )
        return self.queryset.filter(
            models.Q(sender=user) | models.Q(receiver=user)
        )
