from django.contrib.auth import get_user_model
from django.core.cache import cache

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets

from .serializers import RegistrationSerializer, LoginSerializer, CommentSerializer
from .models import Comment
from authentication.services.services_comment import CommentService

from loguru import logger


logger.add('debug.log', format="{time} {level} {message}", level="DEBUG", rotation="10 MB", compression="zip")


User = get_user_model()


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # Log a successful registration
            logger.info(f"User registered successfully: {serializer.validated_data['username']}")

            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

        # Log a registration failure
        logger.error(f"Registration failed: {serializer.errors}")

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = User.objects.filter(email=email).first()

            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                logger.info(f"User {user} successfully registered")
                return Response({
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh)
                }, status=status.HTTP_200_OK)
            else:
                logger.error("Login failed")
                return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        logger.error("Login failed")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        serialized_comments = CommentService.create_comment(data)
        if serialized_comments:
            return Response(serialized_comments, status=status.HTTP_201_CREATED)
        return Response(CommentService.get_serializer_errors(data), status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def get_comments_for_movie(request, movie_slug):
    try:
        # Retrieve comments for the specified movie slug from the database
        serialized_comments = CommentService.get_comments(movie_slug)
        logger.info(f"Get comments from {request.user}")
        return Response(serialized_comments)
    
    except Comment.DoesNotExist:
        logger.error(f"Failed to retrieve comments for movie slug {movie_slug}: {e}")
        return Response(status=404)
    

@api_view(["POST"])
def like_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
        user = request.user
        comment.like_comment(user)
        likes = comment.likes
        return Response({'message': 'Comment liked successfully', 'likes': likes}, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def unlike_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
        user = request.user
        comment.unlike_comment(user)
        likes = comment.likes
        return Response({'message': 'Comment unliked successfully', 'likes': likes}, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)