from django.shortcuts import get_object_or_404
from rest_framework import status

from authentication.serializers import CommentSerializer
from authentication.models import Comment
from authentication.tasks import process_and_publish_new_comments


class CommentService:

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