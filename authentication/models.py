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

    def __repr__(self):
        return self.username

class Comment(models.Model):
    """
        Represents a user's comment on a movie.

        Attributes:
            author (User): The user who wrote the comment.
            movie (Movie): The movie being commented on.
            text (str): The content of the comment.
            created_at (datetime): The date and time when the comment was created.
    """
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, related_name='comments', to_field='slug')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text

    def __repr__(self):
        return self.text
