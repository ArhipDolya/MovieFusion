from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User Model

    Attributes:
        email (EmailField): The unique email address of the user.
    """

    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
