import json
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Movie, Category, Rating
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer

class MovieListViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('movie-list')  # Assuming you have 'movie-list' URL pattern defined
        self.category = Category.objects.create(name='Action')
        self.movie = Movie.objects.create(title='Test Movie', description='Test Description', image='movie_images/Watch-Interstellar-on-Netflix.jpg', release_date='2023-01-01', category=self.category)

    def test_movie_list_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Deserialize the response content as JSON
        response_data = json.loads(response.content)

        # Serialize the expected data to JSON
        serializer = MovieSerializer(self.movie)
        expected_data = json.loads(json.dumps(serializer.data))  # Convert to dictionary

        self.assertEqual(response_data, [expected_data])


class CategoryListViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('category-list')  # Assuming you have 'category-list' URL pattern defined
        self.category = Category.objects.create(name='Action')

    def test_category_list_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Deserialize the response content as JSON
        response_data = json.loads(response.content)

        # Serialize the expected data to JSON
        serializer = CategorySerializer(self.category)
        expected_data = serializer.data

        self.assertEqual(response_data, [expected_data])

class RatingListViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('rating-list')  # Assuming you have 'rating-list' URL pattern defined
        self.category = Category.objects.create(name='Action')
        self.movie = Movie.objects.create(title='Test Movie', description='Test Description', image='test_image.jpg', release_date='2023-01-01', category=self.category)
        self.rating = Rating.objects.create(movie=self.movie, rating=4.5)

    def test_rating_list_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Deserialize the response content as JSON
        response_data = json.loads(response.content)

        # Serialize the expected data to JSON
        serializer = RatingSerializer(self.rating)
        expected_data = serializer.data

        self.assertEqual(response_data, [expected_data])
