from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from .models import Movie, Category, Rating, FavoriteMovie
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer, FavoriteMovieSerializer
from .services_movies import get_movie_ratings, add_movie_to_favorites, remove_movie_from_favorites, get_user_favorite_movie


class MovieListView(ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class RatingListView(ListAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class MovieDetailsView(RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_field = 'slug'

    # Include the rating data when retrieving a movie
    def get_serializer_context(self):
        context = super().get_serializer_context()
        movie_slug = self.kwargs.get('slug')
        context['ratings'] = get_movie_ratings(movie_slug)
        return context


class FavoriteMovieViewSet(viewsets.ModelViewSet):
    queryset = FavoriteMovie.objects.all()
    serializer_class = FavoriteMovieSerializer

    # Override create method to handle adding a movie to favorites
    def create(self, request, *args, **kwargs):
        movie_slug = request.data.get('movie_slug')
        success, result = add_movie_to_favorites(user=request.user, movie_slug=movie_slug)

        if success:
            favorite_movie = FavoriteMovieSerializer(result).data
            return Response(favorite_movie, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': result}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        movie_slug = request.data.get('movie_slug')
        success, result = remove_movie_from_favorites(user=request.user, movie_slug=movie_slug)

        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return NotFound(result)

    def list(self, request, *args, **kwargs):
        favorite_movies = get_user_favorite_movie(user=request.user)
        return Response(favorite_movies)