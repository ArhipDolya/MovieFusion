from rest_framework.generics import ListAPIView

from .models import Movie, Category, Rating
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer


class MovieListView(ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class RatingListView(ListAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer



