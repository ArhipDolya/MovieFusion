from rest_framework import serializers

from .models import Movie, Category, Rating, FavoriteMovie


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)

    class Meta:
        model = Movie
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = Rating
        fields = '__all__'


class FavoriteMovieSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = FavoriteMovie
        fields = '__all__'