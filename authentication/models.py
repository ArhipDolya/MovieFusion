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


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, related_name='comments', to_field='slug')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
