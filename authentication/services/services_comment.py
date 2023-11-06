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

        return None

    @staticmethod
    def update_cache(movie_slug):
        process_and_publish_new_comments.delay(movie_slug)

    @staticmethod
    def get_comments(movie_slug):
        comments = Comment.objects.filter(movie__slug=movie_slug)
        serialized_comments = CommentSerializer(comments, many=True).data

        return serialized_comments

    @staticmethod
    def get_serializer_errors(data):
        serializer = CommentSerializer(data)
        serializer.is_valid()
        return serializer.errors