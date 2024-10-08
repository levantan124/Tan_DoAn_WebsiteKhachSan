import requests
import cloudinary.uploader
from io import BytesIO
from django.shortcuts import get_object_or_404
from django.utils import timezone
from oauth2_provider.models import AccessToken, RefreshToken, Application
from oauth2_provider.settings import oauth2_settings
from oauthlib.common import generate_token
from datetime import timedelta
from requests_oauthlib import OAuth2Session
from django.conf import settings




def google_callback(redirect_uri: str, auth_uri: str):
    session = OAuth2Session(
        settings.GOOGLE_CLIENT_ID,
        redirect_uri=redirect_uri,
        scope=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
    )
    session.fetch_token(
        settings.GOOGLE_TOKEN_URL,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        authorization_response=auth_uri,
    )

    user_data = session.get("https://www.googleapis.com/oauth2/v1/userinfo").json()
    return user_data

def upload_image_from_url(image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        image_data = BytesIO(response.content)
        upload_response = cloudinary.uploader.upload(image_data, use_filename=True, unique_filename=False)
        return upload_response['secure_url']
    return None


def create_user_token(user):
    application = get_object_or_404(Application, name="Tan_Hotel_BE")
    expires = timezone.now() + timedelta(seconds=36000)
    access_token = AccessToken.objects.create(
        user=user,
        scope='read write',
        expires=expires,
        token=generate_token(),
        application=application
    )

    refresh_token = RefreshToken.objects.create(
        user=user,
        token=generate_token(),
        application=application,
        access_token=access_token
    )

    return access_token, refresh_token