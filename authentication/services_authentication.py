from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class UserService:

    @classmethod
    def register_user(cls, username, email, password):
        user = User.objects.create(username=username, email=email)
        user.set_password(password)
        user.save()
        return user

    @classmethod
    def login_user(cls, email, password):
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            return token

        return None