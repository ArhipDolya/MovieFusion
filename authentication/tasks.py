from celery import Celery
from celery_app import app
from django.core.cache import cache
from .serializers import CommentSerializer
from .models import Comment


@app.task
def process_and_publish_new_comments(movie_slug):
    try:
        # Retrieve new comments for the specified movie slug
        comments = Comment.objects.filter(movie__slug=movie_slug)
        serialized_comments = CommentSerializer(comments, many=True).data

        # Publish a message about new comments to a Redis channel
        cache_key = f'comments_{movie_slug}'

        cache.set(cache_key, serialized_comments, 15)
    except Comment.DoesNotExist:
        pass