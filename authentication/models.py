from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from django.db.models import F


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
    likes = models.IntegerField(default=0)

    @transaction.atomic
    def like_comment(self, user):
        if not self.is_liked_by(user):
            Like.objects.create(user=user, comment=self)
            self.likes += 1
            self.save()
            self.refresh_from_db()

    @transaction.atomic
    def unlike_comment(self, user):
        like = Like.objects.filter(user=user, comment=self).first()
        if like:
            like.delete()
            self.likes -= 1
            self.save()
            self.refresh_from_db()


    def update_comment_text(self, new_text, user):
        if user == self.author:
            self.text = new_text
            self.save()
            return True
        
        return False


    def is_liked_by(self, user):
        return self.likes > 0


    def __str__(self):
        return self.text

    def __repr__(self):
        return self.text


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)


    def __str__(self):
        return self.user.username
    
    def __repr__(self):
        return self.user.username