#urls.py
from rest_framework import routers
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

#

r = routers.DefaultRouter()
r.register(r'chat-rooms', views.RoomChatViewSet, basename='chatroom')

urlpatterns = [
    path('', include(r.urls)),
    # path('o/', include('oauth2_provider.urls', namespace='oauth2_provider'))
]
