from django.contrib.auth import get_user_model
from django.core.mail import send_mail, BadHeaderError

from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from loguru import logger


User = get_user_model()

logger.add('debug.log', format="{time} {level} {message}", level="DEBUG", rotation="10 MB", compression="zip")


class UserService:
    """
    Service class for user-related operations.

    Methods:
        - register_user: Register a new user with the provided username, email, and password.
        - login_user: Log in a user with the provided email and password, returning a JWT token upon success.
    """

    @classmethod
    def register_user(cls, username: str, email: str, password: str) -> User:
        user = User.objects.create(username=username, email=email)
        user.set_password(password)
        user.save()
        return user


    @classmethod
    def login_user(cls, email: str, password: str) -> str:
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            return token

        raise ValidationError("Invalid email or password.")
    

class EmailService:

    @classmethod
    def send_registration_email(cls, user):
        try:
            subject = 'Welcome to MovieFusion'
            message = f"Hello {user.username}.\n\nThank you for registering on MovieFusion! We hope you enjoy our platform.\n\nBest regards,\nThe MovieFusion Team"
            from_email = 'arhipdolya6995@gmail.com'
            to_email = user.email

            send_mail(subject, message, from_email, [to_email])
            logger.info(f"Email sent successfully to {to_email}")
        except BadHeaderError as e:
            logger.error(f"BadHeaderError: {e}")
        except Exception as e:
            logger.error(f"Error sending email: {e}")