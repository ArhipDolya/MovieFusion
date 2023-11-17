from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from ..models import Category, FavoriteMovie, Movie, Rating, User
from ..serializers import MovieSerializer, RatingSerializer


class MovieListViewTest(TestCase):
    def setUp(self):
        # Create some Movie instances for testing
        Movie.objects.create(title="Movie 1", description="Description 1", slug="movie-1")
        Movie.objects.create(title="Movie 2", description="Description 2", slug="movie-2")


    def test_movie_list_view(self):
        # Create an instance of the Django test client
        client = APIClient()

        # Make a GET request to the MovieListView
        response = client.get('/api/v1/movies/')

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Get the expected serialized data for the movies
        expected_data = MovieSerializer(Movie.objects.all(), many=True).data

        # Assert that the response data matches the expected data
        self.assertEqual(response.data, expected_data)


#class CategoryListViewTest(TestCase):
#    def setUp(self):
#        # Create some Category instances for testing
#        Category.objects.create(name="Category 1")
#        Category.objects.create(name="Category 2")
#
#
#    def test_category_list_view_with_cache(self):
#        # Create an instance of the Django test client
#        client = APIClient()
#
#        # Make a GET request to the CategoryListView
#        response = client.get('/api/v1/categories/')
#
#        # Assert that the response status code is 200 (OK)
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#        # Get the expected serialized data for the categories
#        expected_data = response.data
#
#        # Assert that the response data matches the expected data
#        self.assertEqual(response.data, expected_data)
#
#        # Make another GET request to the CategoryListView
#        response_cached = client.get('/api/v1/categories/')
#
#        # Assert that the response status code is 200 (OK) for the cached request
#        self.assertEqual(response_cached.status_code, status.HTTP_200_OK)
#
#        # Assert that the cached response data matches the expected data
#        self.assertEqual(response_cached.data, expected_data)


class RatingViewSetTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a test movie
        self.movie = Movie.objects.create(title='Test Movie', slug='test-movie', description='Test Description')


    def test_create_rating(self):
        # Create an instance of the Django test client
        client = APIClient()

        # Authenticate the test user
        client.force_authenticate(user=self.user)

        # Prepare the data for creating a rating
        data = {
            'movie': self.movie.slug,
            'rating': '4.5',
        }

        # Make a POST request to create a rating
        response = client.post('/api/v1/ratings/', data)

        # Assert that the response status code is 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert that the rating was created for the movie and user
        rating = Rating.objects.get(user=self.user, movie=self.movie)
        self.assertEqual(response.data, RatingSerializer(rating).data)


    def test_create_rating_invalid_movie(self):
        client = APIClient()

        # Authenticate the test user
        client.force_authenticate(user=self.user)

        # Prepare invalid data with a non-existing movie slug
        data = {
            'movie': 'non-existing-movie',
            'rating': '4.5',
        }

        # Make a POST request to create a rating with an invalid movie slug
        response = client.post('/api/v1/ratings/', data)

        # Assert that the response status code is 400 (Bad Request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MovieDetailsViewTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a test category
        self.category = Category.objects.create(name='Test Category')

        # Create a test movie
        self.movie = Movie.objects.create(
            title='Test Movie',
            slug='test-movie',
            description='Test Description',
            image='test-image.jpg',
            release_date='2023-01-01',
            director='Test Director',
            writers='Test Writer 1, Test Writer 2',
            actors='Test Actor 1, Test Actor 2',
            youtube_trailer_url='https://www.youtube.com/watch?v=test-trailer'
        )
        self.movie.categories.add(self.category)

        # Create a test rating for the movie
        self.rating = Rating.objects.create(user=self.user, movie=self.movie, rating=4.5)


    def test_movie_details_view_not_found(self):
        # Create an instance of the Django test client
        client = APIClient()

        # Make a GET request to the MovieDetailsView with an invalid movie slug
        response = client.get('/api/v1/movies/non-existing-movie/')

        # Assert that the response status code is 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class FavoriteMovieViewSetTest(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a test movie
        self.movie = Movie.objects.create(
            title='Test Movie',
            slug='test-movie',
            description='Test Description',
            image='test-image.jpg',
            release_date='2023-01-01',
            director='Test Director',
            writers='Test Writer 1, Test Writer 2',
            actors='Test Actor 1, Test Actor 2',
            youtube_trailer_url='https://www.youtube.com/watch?v=test-trailer'
        )

        # Authenticate the test user
        self.client.force_authenticate(user=self.user)

    def test_add_movie_to_favorites(self):
        # Make a POST request to add the movie to favorites
        response = self.client.post('/api/v1/favorite-movies/', {'movie_slug': self.movie.slug})

        # Assert that the response status code is 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert that the movie is added to favorites for the user
        self.assertTrue(FavoriteMovie.objects.filter(user=self.user, movie=self.movie).exists())

    def test_remove_movie_from_favorites(self):
        # Add the movie to favorites before testing removal
        FavoriteMovie.objects.create(user=self.user, movie=self.movie)

        # Make a DELETE request to remove the movie from favorites
        response = self.client.delete('/api/v1/favorite-movies/', {'movie_slug': self.movie.slug})

        # Assert that the response status code is 204 (No Content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Assert that the movie is removed from favorites for the user
        self.assertFalse(FavoriteMovie.objects.filter(user=self.user, movie=self.movie).exists())

    def test_list_favorite_movies(self):
        # Add some movies to favorites for the user
        movie1 = Movie.objects.create(title='Movie 1', slug='movie-1', description='Description 1')
        movie2 = Movie.objects.create(title='Movie 2', slug='movie-2', description='Description 2')
        FavoriteMovie.objects.create(user=self.user, movie=movie1)
        FavoriteMovie.objects.create(user=self.user, movie=movie2)

        # Make a GET request to list favorite movies
        response = self.client.get('/api/v1/favorite-movies/')

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the response data contains the expected movies
        self.assertEqual(len(response.data), 2)
        self.assertIn(movie1.title, [movie['movie']['title'] for movie in response.data])
        self.assertIn(movie2.title, [movie['movie']['title'] for movie in response.data])


class AverageRatingViewTest(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a test movie
        self.movie = Movie.objects.create(
            title='Test Movie',
            slug='test-movie',
            description='Test Description',
            image='test-image.jpg',
            release_date='2023-01-01',
            director='Test Director',
            writers='Test Writer 1, Test Writer 2',
            actors='Test Actor 1, Test Actor 2',
            youtube_trailer_url='https://www.youtube.com/watch?v=test-trailer'
        )

    def test_get_average_rating_movie_exists(self):
        # Create some ratings for the movie
        Rating.objects.create(user=self.user, movie=self.movie, rating=4.5)
        Rating.objects.create(user=self.user, movie=self.movie, rating=3.0)
        Rating.objects.create(user=self.user, movie=self.movie, rating=2.5)

        # Make a GET request to get the average rating for the movie
        response = self.client.get(f'/api/v1/movies/{self.movie.slug}/average-ratings/')

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the response data contains the correct average rating
        self.assertEqual(round(float(response.data['average_rating']), 2), 3.33)

    def test_get_average_rating_movie_not_found(self):
        # Make a GET request to get the average rating for a non-existing movie
        response = self.client.get('/api/v1/movies/non-existing-movie/average-ratings/')

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the response data contains an average rating of 0
        self.assertEqual(response.data['average_rating'], 0)