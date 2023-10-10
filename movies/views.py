from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Movie, Category, Rating
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer


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
    lookup_field = 'id'

    # Include the rating data when retrieving a movie
    def get_serializer_context(self):
        context = super().get_serializer_context()
        movie_id = self.kwargs.get('id')
        context['ratings'] = Rating.objects.filter(movie_id=movie_id)
        return context

