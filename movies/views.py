from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Movie, Category, Rating, FavoriteMovie
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer, FavoriteMovieSerializer
from .services_movies import get_movie_ratings, add_movie_to_favorites, remove_movie_from_favorites, get_user_favorite_movie


class MovieListView(ListAPIView):
    """
    List and retrieve movies.
    """

    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class CategoryListView(ListAPIView):
    """
    List movie categories.

    This view provides a list of all available movie categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class RatingListView(ListAPIView):
    """
    List movie ratings.

    This view provides a list of all movie ratings.
    """

    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class MovieDetailsView(RetrieveAPIView):
    """
    Retrieve movie details.

    This view allows you to retrieve detailed information about a specific movie based on its slug.

    Returns detailed information about a specific movie, including its title, description, categories, and ratings.
    """

    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        movie_slug = self.kwargs.get('slug')
        context['ratings'] = get_movie_ratings(movie_slug)
        return context


class FavoriteMovieViewSet(viewsets.ModelViewSet):
    """
    Manage favorite movies.

    This viewset allows users to add, remove, and get their favorite movies.

    # Add Movie to Favorites
    Adds a movie to the user's list of favorite movies. Requires the 'movie_slug' in the request data.

    # Remove Movie from Favorites
    Removes a movie from the user's list of favorite movies. Requires the 'movie_slug' in the request data.

    # List Favorite Movies
    Lists all movies that the user has marked as favorites.
    """

    queryset = FavoriteMovie.objects.all()
    serializer_class = FavoriteMovieSerializer
    permission_classes = [IsAuthenticated]

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