from django.shortcuts import get_object_or_404
from rest_framework import status

from authentication.serializers import CommentSerializer
from authentication.models import Comment
from authentication.tasks import process_and_publish_new_comments


class CommentService:
    """
    Service class for handling comments on movies.

    Methods:
        - create_comment: Create a new comment, update the cache, and retrieve all comments for a movie.
        - update_cache: Update the cache for a specific movie's comments.
        - get_comments: Retrieve all comments for a specific movie.
        - get_serializer_errors: Get errors from the comment serializer.
        - get_comment_by_id_or_404: Retrieve a comment by its ID or return a 404 response if not found.
        - like_comment: Like a comment and return the updated likes count.
        - unlike_comment: Unlike a comment and return the updated likes count.
        - update_comment_text: Update the text of a comment if the user has the necessary permissions.
    """

    @staticmethod
    def create_comment(data):
        serializer = CommentSerializer(data=data)

        if serializer.is_valid():
            comment = serializer.save()
            movie_slug = comment.movie.slug
            CommentService.update_cache(movie_slug)
            return CommentService.get_comments(movie_slug)

        else:
            return {'error': 'Invalid comment data'}, status.HTTP_400_BAD_REQUEST


    @staticmethod
    def update_cache(movie_slug):
        process_and_publish_new_comments.delay(movie_slug)


    @staticmethod
    def get_comments(movie_slug):
        comments = Comment.objects.filter(movie__slug=movie_slug).prefetch_related('movie')
        serialized_comments = CommentSerializer(comments, many=True).data

        return serialized_comments


    @staticmethod
    def get_serializer_errors(data):
        serializer = CommentSerializer(data)
        serializer.is_valid()
        return serializer.errors
    

    @staticmethod
    def get_comment_by_id_or_404(comment_id):
        return get_object_or_404(Comment, id=comment_id)


    @staticmethod
    def like_comment(comment, user):
        try:
            comment.like_comment(user)
            likes = comment.likes
            return {'message': 'Comment liked successfully', 'likes': likes}, status.HTTP_200_OK
        except Comment.DoesNotExist:
            return {'error': 'Comment not found'}, status.HTTP_404_NOT_FOUND


    @staticmethod
    def unlike_comment(comment, user):
        try:
            comment.unlike_comment(user)
            likes = comment.likes
            return {'message': 'Comment unliked successfully', 'likes': likes}, status.HTTP_200_OK
        except Comment.DoesNotExist:
            return {'error': 'Comment not found'}, status.HTTP_404_NOT_FOUND
        

    @staticmethod
    def update_comment_text(comment, new_text, user):
        if comment.update_comment_text(new_text, user):
            return {'message': 'Comment text updated successfully'}, status.HTTP_200_OK
        else:
            return {'error': 'You are not allowed to update this comment'}, status.HTTP_403_FORBIDDEN