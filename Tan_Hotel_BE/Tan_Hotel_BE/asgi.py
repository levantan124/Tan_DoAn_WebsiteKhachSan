"""
ASGI config for Tan_Hotel_BE project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django



django.setup()

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from addon.routing import websocket_urlpatterns
from channels.security.websocket import AllowedHostsOriginValidator


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Tan_Hotel_BE.settings')

# ASGI application
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket':
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        ),
})
