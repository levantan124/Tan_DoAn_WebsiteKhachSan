#admin.py
from django.contrib import admin
from addon.models import RoomChat, Messages

admin.site.register(RoomChat)
admin.site.register(Messages)