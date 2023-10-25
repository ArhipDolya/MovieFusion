from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from .models import Movie, Category, Rating, FavoriteMovie
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer, FavoriteMovieSerializer
from .services_movies import get_movie_ratings


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
        try:
            movie = Movie.objects.get(slug=movie_slug)
        except Movie.DoesNotExist:
            raise NotFound('Movie not found')

        # Check if the movie is already in the user's favorites
        existing_favorite_movie = FavoriteMovie.objects.filter(user=request.user, movie=movie).first()

        if existing_favorite_movie:
            return Response({'detail': 'Movie is already in favorites.'}, status=status.HTTP_400_BAD_REQUEST)

        favorite_movie = FavoriteMovie.objects.create(user=request.user, movie=movie)
        return Response(FavoriteMovieSerializer(favorite_movie).data, status=status.HTTP_201_CREATED)

    # Override destroy method to handle removing a movie from favorites
    def destroy(self, request, *args, **kwargs):
        movie_slug = request.data.get('movie_slug')
        try:
            movie = Movie.objects.get(slug=movie_slug)
        except Movie.DoesNotExist:
            raise NotFound('Movie not found')

        favorite_movie = FavoriteMovie.objects.filter(user=request.user, movie=movie).first()
        if favorite_movie:
            favorite_movie.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise NotFound('Movie not in favorites')