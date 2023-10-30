from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework import serializers

from .models import Movie, Category, Rating, FavoriteMovie, User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    average_rating = serializers.ReadOnlyField(source='calculating_average_rating')

    class Meta:
        model = Movie
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    movie = MovieSerializer()
    rating = serializers.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])

    class Meta:
        model = Rating
        fields = '__all__'


class FavoriteMovieSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = FavoriteMovie
        fields = '__all__'